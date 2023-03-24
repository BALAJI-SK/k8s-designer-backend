const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const folderUtility = require('../utility/folder.utility.js');

const zipFolder = (folderPath, outputPath) => {
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  const outputFilePath = path.resolve(outputPath);

  return new Promise((resolve, reject) => {
    const resolvedFolderPath = path.resolve(folderPath);
    folderUtility
      .doesFolderExist(resolvedFolderPath)
      .then(() => {
        const folderName = path.parse(resolvedFolderPath).base;

        const output = fs.createWriteStream(outputFilePath);

        archive.pipe(output);
        archive.directory(resolvedFolderPath, folderName);
        archive.finalize();
        
        output.on('close', () => {
          resolve(outputFilePath);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  zipFolder,
};
