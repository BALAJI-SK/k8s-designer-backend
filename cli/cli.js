#!/usr/bin/env node

const path = require('path');
const { resolve } = require('path');
const { OUTPUT_PATH } = require('../src/constants/app.constants');
const dockerComposeGenerator = require('../src/services/generators/docker-compose');
const generateDockerImage = require('../src/services/generators/docker-image');
const { generateBoilerplate } = require('../src/services/generators/generateBoilerplate.service');
const k8sManifestGenerator = require('../src/services/generators/k8s-manifest');
const pushDockerImage = require('../src/services/pushDockerImage');
const { getConfigurations } = require('../src/utility/generators.utils');
const [ , , filepath ] = process.argv;
const serviceDataPath = resolve(process.cwd(), filepath);
const fs = require('fs-extra');

console.log('this is path: ', serviceDataPath);

const services = require(serviceDataPath);

const getZip = async (services) => {
  const projectId = filepath.split('/')[1].split('.')[0];
  const boilerplatesPath = path.resolve(process.cwd(), projectId.toString());
  const folderPath = path.join(OUTPUT_PATH, projectId.toString());
  const configurations = getConfigurations(services);
  console.log(configurations);
  let generatorResponses = [];
  Object.keys(configurations).forEach((microservice)=>{
    generatorResponses.push(generateBoilerplate(projectId, microservice, configurations));
  });
  await Promise.all(generatorResponses);
  console.log('All boilerplates generated');
    
  await dockerComposeGenerator(projectId, configurations);
  console.log('Docker compose generated');
    
  await k8sManifestGenerator(projectId);
  console.log('K8s manifest generated');
      
  generateDockerImage(projectId, configurations).then(() => {
    console.log('Docker image generated');
    pushDockerImage(configurations).then(() => {
      console.log('Docker image pushed');
      fs.rmSync(folderPath, { recursive: true, force: true });
    });
  });
  fs.copy(folderPath, boilerplatesPath, err => {
    if(err) return console.error(err);
    console.log('success!');
  });
};

getZip(services).then(() => {
  console.log('Done');
}).catch((err) => {
  console.log('Error: ', err);
});
