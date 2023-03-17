const ProjectService = require('../services/project.service');


const generateProjectController = async (req,res)=>{
  try{
    console.log(req.body);
    const zipPath = await ProjectService.generateProject(req.body);
    res.status(200).download(zipPath);
  }catch (err) {
    console.log(err);
    res.status(500).json({data:err.message});
  }

};

module.exports = {generateProjectController};