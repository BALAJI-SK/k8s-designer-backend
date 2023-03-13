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
    hygenProcess.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(code);
      }
    });
  });
};


const generateBoilerplate = (projectId, microservice, config) => {
  const response = [];
  switch (microservice) {
  case 'frontend':
    config.frontend.forEach((frontend) => {
      response.push(runHygen(projectId, microservice, 'single', frontend));
    });
    break;
  case 'backend':
    config.backend.forEach((backend) => {
      backend.databases.forEach((db) => {
        const database = {
          appName: backend.appName,
          database: db,
        };
        response.push(runHygen(projectId, microservice, 'many', database));
      });
      response.push(runHygen(projectId, microservice, 'single', backend));
    });
    break;
  case 'database':
    config.database.forEach((db) => {
      response.push(
        runHygen(projectId, microservice, 'many', { database: db })
      );
    });
    break;
  default:
    return Promise.reject('Invalid microservice');
  }
  return Promise.all(response);
};

module.exports = { generateBoilerplate, runHygen };
