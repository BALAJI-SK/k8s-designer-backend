const prisma = require('../config/prisma.config');

const create= async (data)=>{
  try{
    const backendServicesResult = await prisma.backendService.create(
      {data }
    );
    return backendServicesResult;
  }catch(e){
    console.log(e);

    throw new Error('Error creating backendService: ',{cause:e});
  }
 
};
const getConfigurations = async (serviceId)=>{
  try{
    const services = await prisma.backendService.findMany({
      where:{
        serviceId
      },
    });
    return services;
  }catch(e){
    console.log(e);
    throw new Error('Error getting services: ',{cause:e});
  }
};

module.exports = {create, getConfigurations}; 