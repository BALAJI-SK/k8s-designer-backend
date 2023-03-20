//commenting this because create new user is not functional as of now
const router = require('express').Router();
const userRoutes = require('./user.routes');
const projectRoutes = require('./project.routes');

router.use('/user', userRoutes);
router.use('/projects', projectRoutes);
module.exports = router; 