var Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });

const pushDockerImage = async (config) => {

  await Promise.all(
    config.map(async (boilerplate) => {
      const { name, username, password, email, serverAddress, imageName } = boilerplate;

      await new Promise((resolve, reject) => {
        const image = docker.getImage(imageName);

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
              const dataArray = data.toString().split('\n');
              dataArray.forEach((data) => {
                const parsedData = JSON.parse(data);
                if (parsedData.error) {
                  reject(`Failed to push ${username}/${name}: ${parsedData.error}`);
                }
                
              });
            });

            stream.on('end', () => {
              image.remove({ force: true }, (err) => {
                console.error(`Failed to delete ${username}/${name}: ${err}`);
              });

              resolve();
            });

            stream.on('error', (err) => {
              console.log(`Failed to push ${username}/${name}: ${err}`);
              reject(err);
            });
          });
        // .catch((err) => {
        //   reject(err);
        // });
      });
    })
  );
};

module.exports = pushDockerImage;
