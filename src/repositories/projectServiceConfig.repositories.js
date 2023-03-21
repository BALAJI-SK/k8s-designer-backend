
const prisma = require('../config/prisma.config');

const create= async (data)=>{
  try{
    const projectServiceConfigResult = await prisma.projectServiceConfig.create(
      {data }
    );
    return projectServiceConfigResult;
  }catch(e){
    // console.log(e);
    throw new Error('Error creating ProjectServiceConfig: ',{cause:e});
  }
 
};
const getServices = async (projectId)=>{
  try{
    const services = await prisma.projectServiceConfig.findMany({
      where:{
        projectId
      },
    });
    return services;
  }catch(e){
    // console.log(e);
    throw new Error('Error getting services: ',{cause:e});
  }
};

module.exports = {create, getServices}; 