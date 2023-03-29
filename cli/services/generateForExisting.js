const cli = require('cli');
const { resolve } = require('path');
const { buildImage } = require('../../src/services/generators/docker-image');
const k8sManifestGenerator = require('../../src/services/generators/k8s-manifest');
const loadLocalImage = require('../../src/services/loadLocalImage');
const yaml = require('js-yaml');
const fs = require('fs').promises;

const generateForExisting = async (dockerComposePath) => {

  const dockerCompose = await fs.readFile(dockerComposePath, 'utf8');
  const dockerComposeObject = yaml.load(dockerCompose);
  let microservices = Object.keys(dockerComposeObject.services).map((microservice) => {
  
    if(!dockerComposeObject.services[microservice].build){
      if(dockerComposeObject.services[microservice].image){
        return;
      }
      else{
        throw new Error('Please provide the image tag or build tag for the service ' + microservice);
      }
    }
  
    const dockerFilePath = (typeof dockerComposeObject.services[microservice].build === 'object')
      ?
      dockerComposeObject.services[microservice].build.context + '/' + dockerComposeObject.services[microservice].build.dockerfile
      :
      dockerComposeObject.services[microservice].build + '/Dockerfile';
      
    return {
      name: microservice,
      dockerFilePath: resolve(dockerComposePath.split('/').slice(0, -1).join('/'), dockerFilePath),
    };
  });
  microservices = microservices.filter((microservice) => microservice);
  
  const k8sManifestPath = dockerComposePath.split('/').slice(0, -1).join('/') + '/k8s-manifest.yaml';
  await k8sManifestGenerator(dockerComposePath, k8sManifestPath);
  
  const k8string = await fs.readFile(k8sManifestPath, 'utf8');
  const k8yamlObject = yaml.loadAll(k8string);
  k8yamlObject.forEach((k8yamlObjectItem) => {
    if(k8yamlObjectItem.kind === 'Deployment'){
      k8yamlObjectItem.spec.template.spec.containers.forEach((container) => {
        container.imagePullPolicy = 'IfNotPresent';
      });
    }
  });
  await fs.writeFile(k8sManifestPath, '---\n' + k8yamlObject.map(doc => yaml.dump(doc)).join('---\n'));
  
  cli.ok('K8s manifest generated');
  
  cli.spinner('Generating docker images..');
  await Promise.all(microservices.map((microservice) => {
    return buildImage(microservice.dockerFilePath, microservice.name);
  }));
  cli.spinner('Generating docker images..', true);
  cli.ok('Docker images generated');
  
  const configurations = microservices.map((microservice) => {
    return {
      imageName: microservice.name,
    };
  });
  cli.spinner('Loading docker images to minikube..');
  await loadLocalImage(configurations);
  cli.spinner('Loading docker images to minikube..', true);
  cli.ok('Docker images loaded to minikube');
  
};

module.exports = generateForExisting;