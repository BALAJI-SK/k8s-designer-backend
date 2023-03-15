const prisma = require('../config/prisma.config');

const create= async (data)=>{
    try{
        const imageServicesResult = await prisma.imageRepository.create(
            {data }
        );
        return imageServicesResult;
    }catch(e){
        console.log(e);

        throw new Error('Error creating new Image repository entry: ',{cause:e});
    }
 
};


module.exports = {create}; 