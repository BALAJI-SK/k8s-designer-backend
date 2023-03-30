
const { getConfigurations, getBoilerplatesConfig } = require('../utility/generators.utils');
const repositoryServiceObj = require('../utility/projects.utils');
const dockerComposeGenerator = require('./generators/docker-compose');
const { generateBoilerplate } = require('./generators/generateBoilerplate.service');
const k8sManifestGenerator = require('./generators/k8s-manifest');
const projectRepository = require('../repositories/project.repositories');
const {generateDockerImage} = require('./generators/docker-image');
const pushDockerImage = require('./pushDockerImage');
const { OUTPUT_PATH, DOCKER_COMPOSE_FILE_NAME, K8S_MANIFEST_FILE_NAME } = require('../constants/app.constants');
const path = require('path');
const { zipFolder } = require('./zipping.service');
const projectServiceConfig = require('../repositories/projectServiceConfig.repositories');
const frontendService = require('../repositories/frontendService.repositories');
const backendService = require('../repositories/backendService.repositories');
const databaseService = require('../repositories/databaseService.repositories');
const envVariables= require('../repositories/envVariables.repositories');
const imageService = require('../repositories/imageService.repositories');
const loadLocalImage = require('./loadLocalImage');

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
  const configurations = getConfigurations(services, process.env.OFFLINE_ENABLED === 'true');
  console.log(configurations);
  let generatorResponses = [];
  Object.keys(configurations).forEach((microservice)=>{
    generatorResponses.push(generateBoilerplate(projectId, microservice, configurations));
  });
  await Promise.all(generatorResponses);
  console.log('All boilerplates generated');

  await dockerComposeGenerator(projectId, configurations);
  console.log('Docker compose generated');


  const projectDir = path.join(OUTPUT_PATH, projectId.toString());
  const dockerComposePath = path.join(projectDir, DOCKER_COMPOSE_FILE_NAME);
  const k8sManifestPath = path.join(projectDir, K8S_MANIFEST_FILE_NAME);

  await k8sManifestGenerator(dockerComposePath, k8sManifestPath);
  console.log('K8s manifest generated');
  
  const boilerplatesConfig = getBoilerplatesConfig(configurations);
  generateDockerImage(projectId, configurations).then(() => {
    console.log('Docker image generated');
    if(process.env.OFFLINE_ENABLED === 'true'){
      console.log('Loading docker images to minikube');
      loadLocalImage(boilerplatesConfig).then(() => {
        console.log('Docker images loaded to minikube');
      });
    }
    else{
      pushDockerImage(boilerplatesConfig).then(() => {
        console.log('Docker image pushed');
      });

    }
  });
  
  
  const folderPath = path.join(OUTPUT_PATH, projectId.toString());
  const zipPath = path.join(OUTPUT_PATH, `${projectId}.zip`);
  await zipFolder(folderPath, zipPath);
  console.log('Zip generated');

  return zipPath; 
  
};

const getLatestProject = async (userId) =>{
  const project = await projectRepository.getLatestProject(userId);
  // console.log('project',project);
  if(project.length === 0){
    return project;
  }
  const projectId = project[0].id;
  // console.log('projectId',project);
  const services= await projectServiceConfig.getServices(projectId);
  console.log('services',services);
  let result =[];
  for(let i=0;i<services.length;i++){
    const service = services[i];
    const serviceId = service.id;
    const serviceType = service.serviceType;
    const currentService = {service_type: serviceType};
    // console.log(temp);
    if(serviceType === 'FrontEnd'){
      let temp= await frontendService.getConfigurations(serviceId);
      const port = temp[0].port;
      const numberOfReplicas = temp[0].numberOfReplicas;
      const name= temp[0].name;
      currentService.configurations = {port,numberOfReplicas,name};
      // console.log('temp',temp);
    }else if(serviceType === 'BackEnd'){
      let temp= await backendService.getConfigurations(serviceId);
      const port = temp[0].port;
      const numberOfReplicas = temp[0].numberOfReplicas;
      const name= temp[0].name;
      currentService.configurations = {port,numberOfReplicas,name};
      // console.log('temp',port);
    }else if(serviceType === 'Database'){
      let temp= await databaseService.getConfigurations(serviceId);
      const port = temp[0].port;
      const numberOfReplicas = temp[0].numberOfReplicas;
      const name= temp[0].name;
      const dbUser= temp[0].dbUser;
      const dbPassword= temp[0].dbPassword;
      const schemaName= temp[0].schemaName;
      currentService.configurations = {port,numberOfReplicas,name,dbUser,dbPassword,schemaName};
      // console.log('temp',temp);
    }
    const connectedServices = await envVariables.getConnectedServices(serviceId);
    let temp=[];
    for(let j=0;j<connectedServices.length;j++){
      temp =[...temp,connectedServices[j].field];
    }
    currentService.connectedServices = temp;
    const envVariable = await envVariables.getVariables(serviceId);
    temp = {};
    for(let j=0;j<envVariable.length;j++){
      temp ={...temp,[envVariable[j].field]:envVariable[j].value};
    }
    currentService.customEnv= temp;

    const imageRepo = await imageService.getImageRepo(serviceId);
    currentService.imageRepository = {repositoryImageAddress: imageRepo[0]?.imageRepositoryUrl ?? '', username: imageRepo[0]?.username ?? '', email: imageRepo[0]?.email ?? '', token: imageRepo[0]?.imageRepositoryToken ?? ''};
    result=[...result,currentService];
  }
  return result;
};
module.exports = {generateProject, getLatestProject};