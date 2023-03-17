const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const {
  OUTPUT_PATH,
  DOCKER_COMPOSE_FILE_NAME,
  K8S_MANIFEST_FILE_NAME,
} = require('../../constants/app.constants');

const k8sManifestGenerator = async (projectId) => {
  const projectDir = path.join(OUTPUT_PATH, projectId.toString());
  const dockerComposePath = path.join(projectDir, DOCKER_COMPOSE_FILE_NAME);
  return new Promise((resolve, reject) => {
    try {
      const k8sManifestPath = path.join(projectDir, K8S_MANIFEST_FILE_NAME);

      const command = 'kompose';
      const args = ['convert', '-f', dockerComposePath, '-o', k8sManifestPath];

      const child = spawn(command, args);

      const writeStream = fs.createWriteStream(k8sManifestPath);
      child.stdout.pipe(writeStream);

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
