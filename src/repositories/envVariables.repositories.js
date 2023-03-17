
const prisma = require('../config/prisma.config');

const create= async (data)=>{
  try{
    const envVariablesResult = await prisma.envVariables.create(
      {data }
    );
    return envVariablesResult;
  }catch(e){
    throw new Error('Error creating EnvVariables: ',{cause:e});
  }
 
};


module.exports = {create}; 