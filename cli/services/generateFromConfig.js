const cli = require('cli');
const path = require('path');
const { OUTPUT_PATH } = require('../../src/constants/app.constants');
const dockerComposeGenerator = require('../../src/services/generators/docker-compose');
const { generateDockerImage } = require('../../src/services/generators/docker-image');
const { generateBoilerplate } = require('../../src/services/generators/generateBoilerplate.service');
const k8sManifestGenerator = require('../../src/services/generators/k8s-manifest');
const loadLocalImage = require('../../src/services/loadLocalImage');
const pushDockerImage = require('../../src/services/pushDockerImage');
const { getConfigurations } = require('../../src/utility/generators.utils');
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
  
  await k8sManifestGenerator(projectName);
  cli.ok('K8s manifest generated');
  
  await fsExtra.copy(folderPath, boilerplatesPath);
  cli.ok('Generated all the files successfully.'.green);
  console.log('Please wait for the images to be built and pushed before proceeding with deployment'.gray);
        
  cli.spinner('Generating docker images..');
  await generateDockerImage(projectName, configurations);
  cli.spinner('Generating docker images..', true);
  cli.ok('Docker images generated');
  
  if(isOffline){
    cli.spinner('Loading docker images to minikube..');
    await loadLocalImage(configurations);
    cli.spinner('Loading docker images to minikube..', true);
    cli.ok('Docker images loaded to minikube');
  }
  else{
    cli.spinner('Pushing docker images..');
    await pushDockerImage(configurations);
    cli.spinner('Pushing docker images..', true);
    cli.ok('Docker images pushed');
  }
  fsExtra.rmSync(folderPath, { recursive: true, force: true });
  
};

module.exports = generateFromConfig;