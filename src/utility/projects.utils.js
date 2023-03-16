
const projectServiceConfigRepository = require('../repositories/projectServiceConfig.repositories');
const envVariablesRepository = require('../repositories/envVariables.repositories');
const frontendServiceRepository = require('../repositories/frontendService.repositories');
const backendServiceRepository = require('../repositories/backendService.repositories');

const repositoryServiceObj = {
  FrontEnd: async (service, projectId)=>{
    const {service_type,configurations,customEnv} = service;
    const projectServiceConfigResult = await projectServiceConfigRepository.create(
      {
        serviceType:service_type,
        projectId:projectId 
      }
      
    );
    const serviceId= projectServiceConfigResult.id;
        
    await frontendServiceRepository.create(
      
      {
        numberOfReplicas:configurations.numberOfReplicas, 
        name:configurations.name, 
        port:configurations.port,
        serviceId:serviceId
      }
      
    );
    await envVariablesRepository.create(
      {field:customEnv.field,
        value:customEnv.value, 
        serviceId: serviceId,
      });

    return serviceId;
  },

  BackEnd: async (service, projectId)=>{
    const {service_type,configurations,customEnv} = service;
    const projectServiceConfigResult = await projectServiceConfigRepository.create(
      {
        serviceType:service_type,
        projectId:projectId 
      }
      
    );
    const serviceId= projectServiceConfigResult.id;
        
    await backendServiceRepository.create(
      
      {
        numberOfReplicas:configurations.numberOfReplicas, 
        name:configurations.name, 
        port:configurations.port,
        serviceId:serviceId
      }
      
    );
    await envVariablesRepository.create(
      {field:customEnv.field,
        value:customEnv.value, 
        serviceId: serviceId,
      });  
          
    return serviceId;
  },
  Database: ()=>{}
};

module.exports = repositoryServiceObj;