const childProcess = require('child_process');
const path = require('path');
const { OUTPUT_PATH } = require('../../constants/app.constants');

const runHygen = (projectId, generator, action, config) => {
  const projectDir = path.join(OUTPUT_PATH, projectId.toString());
  return new Promise((resolve, reject) => {
    const hygenProcess = childProcess.spawn('npx', [
      'hygen',
      generator,
      action,
      '--outputPath',
      projectDir,
      '--config',
      JSON.stringify(config),
    ]);
    // hygenProcess.stdout.on('data', (data) => {
    //   console.log(data.toString());
    // });
    // hygenProcess.stderr.on('data', (data) => {
    //   console.log(data.toString());
    // });
    hygenProcess.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(code);
      }
    });
  });
};

const generateBoilerplateObj = {
  FrontEnd: (projectId, config) => {
    const response = [];
    config.FrontEnd.forEach((frontend) => {
      response.push(runHygen(projectId, 'frontend', 'basic', frontend));
    });
    return Promise.all(response);
  },
  BackEnd: (projectId, config) => {
    const response = [];
    config.BackEnd.forEach((backend) => {
      backend.databases.forEach((db) => {
        const database = {
          name: backend.name,
          database: db,
        };
        response.push(runHygen(projectId, 'backend', 'module', database));
      });
      response.push(runHygen(projectId, 'backend', 'basic', backend));
    });
    return Promise.all(response);
  },
  Database: (projectId, config) => {
    const response = [];
    config.Database.forEach((db) => {
      response.push(
        runHygen(projectId, 'database', 'module', { database: db })
      );
    });
    return Promise.all(response);
  },
};

const generateBoilerplate = async (projectId, microservice, config) => {
  if (!generateBoilerplateObj[microservice]) {
    throw new Error('Invalid microservice');
  }
  return await generateBoilerplateObj[microservice](projectId, config);
    
};

module.exports = { generateBoilerplate, runHygen };