const fs = require('fs');
const { spawn } = require('child_process');

const k8sManifestGenerator = async (dockerComposePath, k8sManifestPath) => {
  
  return new Promise((resolve, reject) => {
    try {
      const command = 'kompose';
      const args = ['convert', '-f', dockerComposePath, '-o', k8sManifestPath];

      const child = spawn(command, args);

      const writeStream = fs.createWriteStream(k8sManifestPath);
      child.stdout.pipe(writeStream);

      child.stderr.on('data', (data) => {
        if(data.toString().includes('FATA')){
          reject(data.toString());
        }
      });


      child.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(code);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = k8sManifestGenerator;
