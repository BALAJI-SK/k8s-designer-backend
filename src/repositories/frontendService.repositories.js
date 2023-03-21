const prisma = require('../config/prisma.config');

const create= async (data)=>{
  try{
    const frontendServicesResult = await prisma.frontendService.create(
      {data }
    );
    return frontendServicesResult;
  }catch(e){
    // console.log(e);

    throw new Error('Error creating FrontendService: ',{cause:e});
  }
 
};
const getConfigurations = async (serviceId)=>{
  try{
    const services = await prisma.frontendService.findMany({
      where:{
        serviceId
      },
    });
    return services;
  }catch(e){
    // console.log(e);
    throw new Error('Error getting services: ',{cause:e});
  }
};


module.exports = {create, getConfigurations}; 