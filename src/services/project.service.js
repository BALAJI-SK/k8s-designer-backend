
const repositoryServiceObj = require('../utility/projects.utils');
const projectRepository = require('../repositories/project.repositories');

const generateProject = async (data) =>{
  const {services} = data;
  const projectResult = await projectRepository.create(
      
    {userId:'3314ea3f-702a-45f4-b581-732b875cf1fd'}
        
  );
  const projectId =  projectResult.id;
  services.forEach(async (service)=>{
    repositoryServiceObj[service.service_type](service,projectId);
  });
  
  return data;
  
};

module.exports = {generateProject};