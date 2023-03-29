#!/usr/bin/env node

const cli = require('cli');
const colors = require('colors');
const { resolve } = require('path');
const generateForExisting = require('./services/generateForExisting');
const generateFromConfig = require('./services/generateFromConfig');


cli.setUsage('k8s-designer [command] [options]');

cli.parse({
  filepath: ['f', 'Path to the file containing the service data', 'path', null],
  projectName: ['p', 'Name of the project', 'string', 'k8s-designer'],
  dockerComposePath: ['d', 'Path to the docker compose file', 'path', null],
  isOffline: ['o', 'Flag to indicate if the project is being generated in offline mode', 'boolean', false]
}, ['new', 'old']);


const options = cli.parse();


if(cli.command === 'new'){
  const { filepath, projectName, isOffline } = options;
  const serviceDataPath = resolve(process.cwd(), filepath);
  const services = require(serviceDataPath);
  generateFromConfig(services, projectName, isOffline).catch((err) => {
    cli.fatal(colors.red(err));
  });
}
if(cli.command === 'old'){
  const { dockerComposePath} = options;
  generateForExisting(dockerComposePath).catch((err) => {
    cli.fatal(colors.red(err));
  });
}
