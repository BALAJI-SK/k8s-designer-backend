const fs = require('fs');
const yaml = require('js-yaml');
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


      child.on('close', async(code) => {
        if (code === 0) {
          const k8string = await fs.promises.readFile(k8sManifestPath, 'utf8');
          const k8yamlObject = yaml.loadAll(k8string);
          k8yamlObject.forEach((k8yamlObjectItem) => {
            if(k8yamlObjectItem.metadata){
              delete k8yamlObjectItem.metadata.annotations;
            }
            if(k8yamlObjectItem.kind === 'Deployment'){
              delete k8yamlObjectItem.spec.template.metadata.annotations;
            }
          });
          await fs.promises.writeFile(k8sManifestPath, '---\n' + k8yamlObject.map(doc => yaml.dump(doc)).join('---\n'));
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
