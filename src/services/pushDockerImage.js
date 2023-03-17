var Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });
const path = require('path');
const { OUTPUT_PATH } = require('../constants/app.constants');
const getDirectoryNamesInsideFolder = require('../utility/getDirectoryNamesInsideFolder');

const pushDockerImage = async (
  projectId,
  username,
  password,
  email,
  serverAddress
) => {
  const projectDir = path.join(OUTPUT_PATH, projectId.toString());

  const boilerplateNames = await getDirectoryNamesInsideFolder(projectDir);

  await Promise.all(
    boilerplateNames.map(async (boilerplateName) => {
      return new Promise((resolve, reject) => {
        const image = docker.getImage(`${username}/${boilerplateName}`);

        image
          .push({
            authconfig: {
              username,
              password,
              email,
              serveraddress: serverAddress,
            },
          })
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
          .catch(reject);
      });
    })
  );
};

module.exports = pushDockerImage;
