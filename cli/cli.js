#!/usr/bin/env node

const path = require('path');
const cli = require('cli');
const colors = require('colors');
const { resolve } = require('path');
const { OUTPUT_PATH } = require('../src/constants/app.constants');
const dockerComposeGenerator = require('../src/services/generators/docker-compose');
const generateDockerImage = require('../src/services/generators/docker-image');
const { generateBoilerplate } = require('../src/services/generators/generateBoilerplate.service');
const k8sManifestGenerator = require('../src/services/generators/k8s-manifest');
const pushDockerImage = require('../src/services/pushDockerImage');
const { getConfigurations } = require('../src/utility/generators.utils');
const fs = require('fs-extra');
const loadLocalImage = require('../src/services/loadLocalImage');
const Spinner = require('cli-spinner').Spinner;


cli.parse({
  filepath: ['f', 'File path of the microservices configurations', 'string', ''],
  projectName: ['p', 'Name of the folder to be generated', 'string', 'project'],
  isOffline: ['o', 'Upload images directly to minikube instead of remote registry', 'boolean', false],
});
const options = cli.parse();
const { filepath, projectName, isOffline } = options;
const serviceDataPath = resolve(process.cwd(), filepath);
const services = require(serviceDataPath);

const getBoilerplates = async (services) => {
  const boilerplatesPath = path.resolve(process.cwd(), projectName.toString());
  const folderPath = path.join(OUTPUT_PATH, projectName.toString());
  const configurations = getConfigurations(services, isOffline);
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
  cli.ok('Generated all the files successfully.'.green);
  console.log('Please wait for the images to be built and pushed before proceeding with deployment'.gray);
      
  const dockerImageSpinner = new Spinner('Generating docker images.. %s');
  dockerImageSpinner.setSpinnerString('|/-\\');
  dockerImageSpinner.start();
  await generateDockerImage(projectName, configurations);
  dockerImageSpinner.stop(true);
  cli.ok('Docker images generated');

  if(isOffline){
    const loadDockerImageSpinner = new Spinner('Loading docker images to minikube.. %s');
    loadDockerImageSpinner.setSpinnerString('|/-\\');
    loadDockerImageSpinner.start();
    await loadLocalImage(configurations);
    loadDockerImageSpinner.stop(true);
    cli.ok('Docker images loaded to minikube');
  }
  else{
    const pushDockerImageSpinner = new Spinner('Pushing docker images.. %s');
    pushDockerImageSpinner.setSpinnerString('|/-\\');
    pushDockerImageSpinner.start();
    await pushDockerImage(configurations);
    pushDockerImageSpinner.stop(true);
    cli.ok('Docker images pushed');
  }
  fs.rmSync(folderPath, { recursive: true, force: true });

};

getBoilerplates(services).catch((err) => {
  cli.fatal(colors.red(err));
});
