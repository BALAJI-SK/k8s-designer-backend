const ProjectService = require('../services/project.service');
const jwt = require('jsonwebtoken');

const generateProjectController = async (req,res)=>{
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    const zipPath = await ProjectService.generateProject(req.body);
    res.set('Content-Type', 'application/zip');
    res.status(200).download(zipPath);
  }catch (err) {
    console.log(err);
    res.status(500).json({data:err.message});
  }

};
const getLatestProjectController = async (req,res)=>{
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const project = await ProjectService.getLatestProject(decoded.id);
    res.status(200).json(project);
  }catch (err) {
    console.log(err);
    res.status(500).json({data:err.message});
  }
};
module.exports = {generateProjectController, getLatestProjectController};