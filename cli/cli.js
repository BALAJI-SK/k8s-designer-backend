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
const fs = require('fs-extra');


const [ , , filepath ] = process.argv;
const serviceDataPath = resolve(process.cwd(), filepath);
console.log('serviceDataPath: ', serviceDataPath);
const services = require(serviceDataPath);

const getBoilerplates = async (services) => {
  const projectName = serviceDataPath.split('/').pop().split('.')[0];
  const boilerplatesPath = path.resolve(process.cwd(), projectName.toString());
  const folderPath = path.join(OUTPUT_PATH, projectName.toString());
  const configurations = getConfigurations(services);
  let generatorResponses = [];
  Object.keys(configurations).forEach((microservice)=>{
    generatorResponses.push(generateBoilerplate(projectName, microservice, configurations));
  });
  await Promise.all(generatorResponses);
  console.log('All boilerplates generated');
    
  await dockerComposeGenerator(projectName, configurations);
  console.log('Docker compose generated');
    
  await k8sManifestGenerator(projectName);
  console.log('K8s manifest generated');
      
  generateDockerImage(projectName, configurations).then(() => {
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

getBoilerplates(services).then(() => {
  console.log('Done');
}).catch((err) => {
  console.log('Error: ', err);
});
