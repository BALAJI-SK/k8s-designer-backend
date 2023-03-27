const { spawn } = require('child_process');

const loadLocalImage = async (configurations) => {
  const dockerImages = [];
  Object.values(configurations).forEach((microservice) => {
    if(microservice.length === 0) return;
    microservice.forEach((instance) => {
      dockerImages.push(instance.image);
    });
  });
  return Promise.all(
    dockerImages.map((image) => {
      return new Promise((resolve, reject) => {
        const minikubeLoad = spawn('minikube', ['image', 'load', image]);
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