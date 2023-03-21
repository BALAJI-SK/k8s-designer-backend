
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
const getVariables = async (serviceId)=>{
  try{
    const variables = await prisma.envVariables.findMany({
      where:{
        serviceId,
        NOT:{
          value:'connected'
        }
      },
    });
    console.log(variables);
    return variables;
  }catch(e){
    throw new Error('Error getting services: ',{cause:e});
  }
};
const getConnectedServices = async (serviceId)=>{
  try{
    const variables = await prisma.envVariables.findMany({
      select:{
        field: true,
      },
      where:{
        serviceId,
        value:'connected'
      },
    }); 
    return variables;
  }catch(e){
    throw new Error('Error getting services: ',{cause:e});
  }
};

module.exports = {create, getVariables, getConnectedServices}; 