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


module.exports = {create}; 