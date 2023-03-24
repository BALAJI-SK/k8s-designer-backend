var Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });
const path = require('path');
const { OUTPUT_PATH } = require('../../constants/app.constants');

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

      await new Promise((resolve, reject) => {
        const boilerplatePath = path.join(projectDir, name);

        docker
          .buildImage(
            {
              context: boilerplatePath,
              src: ['Dockerfile', '.'],
            },
            { t: image }
          )
          .then((stream) => {
            stream.on('data', () => {});

            stream.on('end', () => {
              resolve();
            });

            stream.on('error', (err) => {
              reject(err);
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
    })
  );
};

module.exports = generateDockerImage;
