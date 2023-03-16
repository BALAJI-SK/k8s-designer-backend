
const repositoryServiceObj = require('../utility/projects.utils');
const projectRepository = require('../repositories/project.repositories');

const generateProject = async (data) =>{
  const {services} = data;
  const projectResult = await projectRepository.create(
      
    {userId:'de7405f2-f2b5-4c8d-95f9-7c8beb3e5023'}
        
  );
  const projectId =  projectResult.id;
  services.forEach(async (service)=>{
    repositoryServiceObj[service.service_type](service,projectId);
  });
  
  return data;
  
};

module.exports = {generateProject};