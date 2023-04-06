#!/usr/bin/env node

const cli = require('cli');
const colors = require('colors');
const process = require('process');
const { resolve } = require('path');
const generateForExisting = require('./services/generateForExisting');
const generateFromConfig = require('./services/generateFromConfig');


cli.setUsage('k8s-designer [OPTIONS]');

cli.parse({
  filepath: ['f', 'Path to the file containing the services\' configurations', 'path', null],
  projectName: ['p', 'Name of the project', 'string', `k8s-project-${Date.now()}`],
  dockerComposePath: ['d', 'Path to the docker compose file', 'path', null],
  isOffline: ['m', 'Flag to indicate if the project is being generated in offline mode (load images directly to minikube)', 'boolean', false]
});


const options = cli.parse();
const {filepath, projectName, dockerComposePath, isOffline} = options;

if(filepath && dockerComposePath){
  cli.fatal(colors.red('Please provide either configurations filepath or dockerComposePath'));
}
else{
  if(filepath){
    const serviceDataPath = resolve(process.cwd(), filepath);
    const services = require(serviceDataPath);
    generateFromConfig(services, projectName, isOffline)
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        cli.fatal(colors.red(err));
      });
  }
  else if(dockerComposePath){
    generateForExisting(dockerComposePath)
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        cli.fatal(colors.red(err));
      });
  }
  else{
    cli.fatal(colors.red('Please provide either configurations filepath or dockerComposePath'));
  }
}

