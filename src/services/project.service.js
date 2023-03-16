
const repositoryServiceObj = require('../utility/projects.utils');
const projectRepository = require('../repositories/project.repositories');

const generateProject = async (data) =>{
  const {services} = data;
  const projectResult = await projectRepository.create(
      
    {userId:'6d5ef481-7340-44c0-991c-df95714d76ac'}
        
  );
  const projectId =  projectResult.id;
  services.forEach(async (service)=>{
    repositoryServiceObj[service.service_type](service,projectId);
  });
  
  return data;
  
};

module.exports = {generateProject};