var Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });

const pushDockerImage = async (config) => {
  let boilerplates = [];

  Object.values(config).forEach((microservice) => {
    microservice.forEach((instance) => {
      boilerplates.push({
        name: instance.name,
        username: instance.username,
        password: instance.token,
        email: instance.email,
        serverAddress: instance.repositoryImageAddress,
      });
    });
  });

  await Promise.all(
    boilerplates.map(async (boilerplate) => {
      const { name, username, password, email, serverAddress } = boilerplate;

      await new Promise((resolve, reject) => {
        const image = docker.getImage(`${username}/${name}`);

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
              image.remove({ force: true }, (err) => {
                if (err) {
                  console.error(`Failed to delete ${username}/${name}: ${err}`);
                } else {
                  console.log(`Deleted ${username}/${name}`);
                }
              });

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

module.exports = pushDockerImage;
