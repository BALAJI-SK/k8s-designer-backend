const prisma = require('../config/prisma.config');

const create= async (data)=>{
  try{
    const imageServiceResult = await prisma.imageRepository.create(
      {data }
    );
    return imageServiceResult;
  }catch(e){
    console.log(e);

    throw new Error('Error creating imageRepository: ',{cause:e});
  }
 
};

const getImageRepo = async (serviceId)=>{
  try{
    const services = await prisma.imageRepository.findMany({
      select:{
        imageRepositoryUrl:true,
        username:true,
        email:true,
        imageRepositoryToken: true,
      },
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

module.exports = {create, getImageRepo}; 