
const projectServiceConfigRepository = require('../repositories/projectServiceConfig.repositories');
const envVariablesRepository = require('../repositories/envVariables.repositories');
const frontendServiceRepository = require('../repositories/frontendService.repositories');
const backendServiceRepository = require('../repositories/backendService.repositories');
const imageServiceRepository = require('../repositories/imageService.repositories');
const databaseServiceRepository = require('../repositories/databaseService.repositories');

const getKeyValuePairs =(obj)=>{
  const keys = Object.keys(obj);
  const values = Object.values(obj);
  const keyValuePair = keys.map((key,index)=>{
    return {field:key,value:values[index]};
  }
  );
  return keyValuePair;
};

const repositoryServiceObj = {
  FrontEnd: async (service, projectId)=>{
    const {service_type,configurations,connected_service, customEnv,imageRepository} = service;
    const projectServiceConfigResult = await projectServiceConfigRepository.create(
      {
        serviceType:service_type,
        projectId:projectId 
      }
      
    );
    const serviceId= projectServiceConfigResult.id;
    
    await frontendServiceRepository.create(
      
      {
        numberOfReplicas:Number(configurations.numberOfReplicas), 
        name:configurations.name, 
        port:configurations.port,
        serviceId:serviceId
      }
      
    );

    if(process.env.OFFLINE_ENABLED === 'false'){

      await imageServiceRepository.create(
        {
          imageRepositoryUrl:imageRepository.repositoryImageAddress,
          imageRepositoryToken:imageRepository.token,
          email: imageRepository.email,
          username: imageRepository.username,
          serviceId:serviceId,
        });
    }
    for(const connectedService of connected_service){
      await envVariablesRepository.create(
        {
          field:connectedService,
          value: 'connected',
          serviceId,
        }
      );
    }
    const envVariables = getKeyValuePairs(customEnv);
    for(const envVariable of envVariables){
      await envVariablesRepository.create(
        {field: envVariable.field,
          value: envVariable.value,
          serviceId,}
      );
    }
    return serviceId;
  },

  BackEnd: async (service, projectId)=>{
    const {service_type,configurations,connected_service, customEnv,imageRepository} = service;
    const projectServiceConfigResult = await projectServiceConfigRepository.create(
      {
        serviceType:service_type,
        projectId:projectId 
      }
      
    );
    const serviceId= projectServiceConfigResult.id;
        
    await backendServiceRepository.create(
      
      {
        numberOfReplicas:Number(configurations.numberOfReplicas),
        name:configurations.name, 
        port:configurations.port,
        serviceId:serviceId
      }
      
    );

    if(process.env.OFFLINE_ENABLED === 'false'){

      await imageServiceRepository.create(
        {
          imageRepositoryUrl:imageRepository.repositoryImageAddress,
          imageRepositoryToken:imageRepository.token,
          email: imageRepository.email,
          username: imageRepository.username,
          serviceId:serviceId,
        });     
    }

    for(const connectedService of connected_service){
      await envVariablesRepository.create(
        {
          field:connectedService,
          value: 'connected',
          serviceId,
        }
      );
    }
    const envVariables = getKeyValuePairs(customEnv);
    for(const envVariable of envVariables){
      await envVariablesRepository.create(
        {
          ...envVariable,
          serviceId,
        }
      );
    }
          
    return serviceId;
  },
  Database: async (service, projectId)=>{
    const {service_type,configurations,connected_service, customEnv,imageRepository} = service;
    const projectServiceConfigResult = await projectServiceConfigRepository.create(
      {
        serviceType:service_type,
        projectId:projectId 
      }
      
    );
    const serviceId= projectServiceConfigResult.id;
        
    await databaseServiceRepository.create(
      {
        ...configurations,
        numberOfReplicas:Number(configurations.numberOfReplicas),
        serviceId:serviceId
      }
      
    );

    if(process.env.OFFLINE_ENABLED === 'false'){

      await imageServiceRepository.create(
        {
          imageRepositoryUrl:imageRepository.repositoryImageAddress,
          imageRepositoryToken:imageRepository.token,
          email: imageRepository.email,
          username: imageRepository.username,
          serviceId:serviceId,
        });
    }
    for(const connectedService of connected_service){
      await envVariablesRepository.create(
        {
          field:connectedService,
          value: 'connected',
          serviceId,
        }
      );
    }
    const envVariables = getKeyValuePairs(customEnv);
    for(const envVariable of envVariables){
      await envVariablesRepository.create(
        {
          ...envVariable,
          serviceId,
        }
      );
    }
          
    return serviceId;
  }
};

module.exports = repositoryServiceObj;