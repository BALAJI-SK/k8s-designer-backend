const cli = require('cli');
const path = require('path');
const { OUTPUT_PATH, DOCKER_COMPOSE_FILE_NAME, K8S_MANIFEST_FILE_NAME } = require('../../src/constants/app.constants');
const dockerComposeGenerator = require('../../src/services/generators/docker-compose');
const { generateDockerImage } = require('../../src/services/generators/docker-image');
const { generateBoilerplate } = require('../../src/services/generators/generateBoilerplate.service');
const k8sManifestGenerator = require('../../src/services/generators/k8s-manifest');
const loadLocalImage = require('../../src/services/loadLocalImage');
const pushDockerImage = require('../../src/services/pushDockerImage');
const { getConfigurations, getBoilerplatesConfig } = require('../../src/utility/generators.utils');
const fsExtra = require('fs-extra');


const generateFromConfig = async (services, projectName, isOffline) => {
  
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

  const projectDir = path.join(OUTPUT_PATH, projectName.toString());
  const dockerComposePath = path.join(projectDir, DOCKER_COMPOSE_FILE_NAME);
  const k8sManifestPath = path.join(projectDir, K8S_MANIFEST_FILE_NAME);
  
  await k8sManifestGenerator(dockerComposePath, k8sManifestPath);
  cli.ok('K8s manifest generated');
  
  await fsExtra.copy(folderPath, boilerplatesPath);
  cli.ok('Generated all the files successfully.'.green);
  console.log('Please wait for the images to be built and pushed before proceeding with deployment'.gray);
        
  cli.spinner('Generating docker images..');
  await generateDockerImage(projectName, configurations);
  cli.spinner('Generating docker images..', true);
  cli.ok('Docker images generated');
  
  const boilerplatesConfig = getBoilerplatesConfig(configurations);
  if(isOffline){
    cli.spinner('Loading docker images to minikube..');
    await loadLocalImage(boilerplatesConfig);
    cli.spinner('Loading docker images to minikube..', true);
    cli.ok('Docker images loaded to minikube');
  }
  else{
    cli.spinner('Pushing docker images..');
    await pushDockerImage(boilerplatesConfig);
    cli.spinner('Pushing docker images..', true);
    cli.ok('Docker images pushed');
  }
  fsExtra.rmSync(folderPath, { recursive: true, force: true });
  
};

module.exports = generateFromConfig;