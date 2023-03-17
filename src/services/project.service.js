
const { getConfigurations } = require('../utility/generators.utils');
const repositoryServiceObj = require('../utility/projects.utils');
const dockerComposeGenerator = require('./generators/docker-compose');
const { generateBoilerplate } = require('./generators/generateBoilerplate.service');
const k8sManifestGenerator = require('./generators/k8s-manifest');
const projectRepository = require('../repositories/project.repositories');
const generateDockerImage = require('./generators/docker-image');
const pushDockerImage = require('./pushDockerImage');
const { OUTPUT_PATH } = require('../constants/app.constants');
const path = require('path');
const { zipFolder } = require('./zipping.service');

const generateProject = async (data) =>{
  const {services} = data;
  // const projectResult = await projectRepository.create(
      
  //   {userId:'de7405f2-f2b5-4c8d-95f9-7c8beb3e5023'}
        
  // );
  // const projectId =  projectResult.id;
  // services.forEach(async (service)=>{
  //   repositoryServiceObj[service.service_type](service,projectId);
  // });
  const projectId = '6d5ef481-7340-44c0-991c-df95714d76ac';
  const configurations = getConfigurations(services);
  console.log(configurations);
  let generatorResponses = [];
  services.forEach((service)=>{
    generatorResponses.push(generateBoilerplate(projectId, service.service_type, configurations));        
  });
  await Promise.all(generatorResponses);
  console.log('All boilerplates generated');
  await dockerComposeGenerator(projectId, configurations);
  console.log('Docker compose generated');
  await generateDockerImage(projectId, configurations.auth.username);
  await pushDockerImage(projectId, configurations.auth.username, configurations.auth.password, configurations.auth.email, configurations.auth.serverAddress);
  
  await k8sManifestGenerator(projectId);
  console.log('K8s manifest generated');
  const folderPath = path.join(OUTPUT_PATH, projectId.toString());
  const zipPath = path.join(OUTPUT_PATH, `${projectId}.zip`);
  await zipFolder(folderPath, zipPath);
  console.log('Zip generated');

  return zipPath;
  
};

module.exports = {generateProject};