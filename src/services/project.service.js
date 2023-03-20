
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
  const {services, userId} = data;
  const projectResult = await projectRepository.create(
      
    {userId}
        
  );
  const projectId =  projectResult.id;
  services.forEach(async (service)=>{
    repositoryServiceObj[service.service_type](service,projectId);
  });
  // const projectId = '6d5ef481-7340-44c0-991c-df95714d76ac';
  const configurations = getConfigurations(services);
  console.log(configurations);
  let generatorResponses = [];
  Object.keys(configurations).forEach((key)=>{
    generatorResponses.push(generateBoilerplate(projectId, key, configurations));
  });
  await Promise.all(generatorResponses);
  console.log('All boilerplates generated');

  await dockerComposeGenerator(projectId, configurations);
  console.log('Docker compose generated');

  generateDockerImage(projectId, configurations).then(() => {
    console.log('Docker image generated');
    pushDockerImage(configurations);
  });
  
  await k8sManifestGenerator(projectId);
  console.log('K8s manifest generated');
  
  const folderPath = path.join(OUTPUT_PATH, projectId.toString());
  const zipPath = path.join(OUTPUT_PATH, `${projectId}.zip`);
  await zipFolder(folderPath, zipPath);
  console.log('Zip generated');

  return zipPath; 
  
};

module.exports = {generateProject};