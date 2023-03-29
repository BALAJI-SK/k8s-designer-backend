const { spawn } = require('child_process');

const loadLocalImage = async (configurations) => {
  return Promise.all(
    configurations.map((boilerplate) => {
      const { imageName } = boilerplate;
      return new Promise((resolve, reject) => {
        const minikubeLoad = spawn('minikube', ['image', 'load', imageName]);
        minikubeLoad.on('close', (code) => {
          if (code === 0) {
            resolve(code);
          } else {
            reject('Error loading image');
          }
        });
      });
    })
  );
};
module.exports = loadLocalImage;