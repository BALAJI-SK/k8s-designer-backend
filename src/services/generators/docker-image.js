var Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });
const path = require('path');
const { OUTPUT_PATH } = require('../../constants/app.constants');

const buildImage = async (dockerfilePath, imageName) => {
  const parentDir = path.dirname(dockerfilePath);
  const dockerfileName = path.basename(dockerfilePath);
  return new Promise((resolve, reject) => {
    docker
      .buildImage(
        {
          context: parentDir,
          src: [dockerfileName, '.'],
        },
        { 
          t: imageName,
          // dockerfile:dockerfilePath 
        }
      )
      .then((stream) => {
        stream.on('data', () => {});

        stream.on('end', () => {
          resolve();
        });

        stream.on('error', (err) => {
          reject(err);
        });
      });
  });
};

const generateDockerImage = async (projectId, config) => {
  const projectDir = path.join(OUTPUT_PATH, projectId.toString());

  let boilerplates = [];

  Object.values(config).forEach((microservice) => {
    microservice.forEach((instance) => {
      boilerplates.push({
        image: instance.image,
        name: instance.name,
      });
    });
  });

  await Promise.all(
    boilerplates.map(async (boilerplate) => {
      const { name, image } = boilerplate;

      const DockerfilePath = path.join(projectDir, name, 'Dockerfile');

      return buildImage(DockerfilePath, image);

    })
  );
};

module.exports = {generateDockerImage, buildImage};
