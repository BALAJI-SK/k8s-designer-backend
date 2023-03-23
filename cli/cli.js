#!/usr/bin/env node

const path = require('path');
const cli = require('cli');
const { resolve } = require('path');
const { OUTPUT_PATH } = require('../src/constants/app.constants');
const dockerComposeGenerator = require('../src/services/generators/docker-compose');
const generateDockerImage = require('../src/services/generators/docker-image');
const { generateBoilerplate } = require('../src/services/generators/generateBoilerplate.service');
const k8sManifestGenerator = require('../src/services/generators/k8s-manifest');
const pushDockerImage = require('../src/services/pushDockerImage');
const { getConfigurations } = require('../src/utility/generators.utils');
const fs = require('fs-extra');
const Spinner = require('cli-spinner').Spinner;


cli.parse({
  filepath: ['f', 'File path of the microservices configurations', 'string', ''],
  projectName: ['p', 'Name of the folder to be generated', 'string', 'project'],
});
const options = cli.parse();
const { filepath } = options;
const { projectName } = options;
const serviceDataPath = resolve(process.cwd(), filepath);
const services = require(serviceDataPath);

const getBoilerplates = async (services) => {
  const boilerplatesPath = path.resolve(process.cwd(), projectName.toString());
  const folderPath = path.join(OUTPUT_PATH, projectName.toString());
  const configurations = getConfigurations(services);
  let generatorResponses = [];
  Object.keys(configurations).forEach((microservice)=>{
    generatorResponses.push(generateBoilerplate(projectName, microservice, configurations));
  });

  await Promise.all(generatorResponses);
  cli.ok('All boilerplates generated');
    
  await dockerComposeGenerator(projectName, configurations);
  cli.ok('Docker compose generated');

  await k8sManifestGenerator(projectName);
  cli.ok('K8s manifest generated');

  await fs.copy(folderPath, boilerplatesPath);
  cli.ok('Generated all files successfully');
      
  const dockerImageSpinner = new Spinner('Generating docker images.. %s');
  dockerImageSpinner.setSpinnerString('|/-\\');
  dockerImageSpinner.start();
  await generateDockerImage(projectName, configurations);
  dockerImageSpinner.stop(true);
  cli.ok('Docker images generated');

  const pushDockerImageSpinner = new Spinner('Pushing docker images.. %s');
  pushDockerImageSpinner.setSpinnerString('|/-\\');
  pushDockerImageSpinner.start();
  await pushDockerImage(configurations);
  pushDockerImageSpinner.stop(true);
  cli.ok('Docker images pushed');

  fs.rmSync(folderPath, { recursive: true, force: true });

};

getBoilerplates(services).catch((err) => {
  cli.error('Error: ', err.message);
});
