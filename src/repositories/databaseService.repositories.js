const prisma = require('../config/prisma.config');

const create= async (data)=>{
  try{
    const databaseServicesResult = await prisma.databaseService.create(
      {data }
    );
    return databaseServicesResult;
  }catch(e){
    throw new Error('Error creating databaseService: ',{cause:e});
  }
 
};

const getConfigurations = async (serviceId)=>{
  try{
    const services = await prisma.databaseService.findMany({
      where:{
        serviceId
      },
    });
    return services;
  }catch(e){
    throw new Error('Error getting services: ',{cause:e});
  }
};

module.exports = {create, getConfigurations}; 