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


module.exports = {create}; 