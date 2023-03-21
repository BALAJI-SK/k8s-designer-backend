const prisma = require('../config/prisma.config');

const create= async (data)=>{
  try{
    const projectResult = await prisma.project.create(
      {data }
    );
    return projectResult;
  }catch(e){
    console.log(e);

    throw new Error('Error creating project: ',{cause:e});
  }
 
};
const getLatestProject = async (userId)=>{
  try{
    const projectResult = await prisma.project.findMany({
      where:{
        userId
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 1,
    });
    return projectResult;
  }catch(e){
    console.log(e);
    throw new Error('Error getting latest project: ',{cause:e});
  }
};


module.exports = {create, getLatestProject}; 