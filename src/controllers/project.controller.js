const ProjectService = require('../services/project.service');
const jwt = require('jsonwebtoken');

const generateProjectController = async (req,res)=>{
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    const zipPath = await ProjectService.generateProject(req.body);
    res.status(200).download(zipPath);
  }catch (err) {
    console.log(err);
    res.status(500).json({data:err.message});
  }

};

module.exports = {generateProjectController};