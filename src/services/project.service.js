
const repositoryServiceObj = require('../utility/projects.utils');
const projectRepository = require('../repositories/project.repositories');

const generateProject = async (data) =>{
  const {services} = data;
  const projectResult = await projectRepository.create(
      
    {userId:'46eb287c-4527-440e-b589-4ae91282ec81'}
        
  );
  const projectId =  projectResult.id;
  services.forEach(async (service)=>{
    repositoryServiceObj[service.service_type](service,projectId);
  });
  
  return data;
  
};

module.exports = {generateProject};