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
        name: instance.name,
        username: instance.username,
      });
    });
  });

  await Promise.all(
    boilerplates.map(async (boilerplate) => {
      const { name, username } = boilerplate;

      await new Promise((resolve, reject) => {
        const boilerplatePath = path.join(projectDir, name);

        docker
          .buildImage(
            {
              context: boilerplatePath,
              src: ['Dockerfile', '.'],
            },
            { t: `${username}/${name}` }
          )
          .then((stream) => {
            stream.on('data', (data) => {
              console.log(data.toString());
            });

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

// generateDockerImage(1, {
//   frontend: [
//     {
//       name: "frontend",
//       username: "preetindersingh",
//     },
//   ],

//   backend: [
//     {
//       name: "backend",
//       username: "preetindersingh",
//     },
//   ],

//   database: [],
// });

module.exports = generateDockerImage;
