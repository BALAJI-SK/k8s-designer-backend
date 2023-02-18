const fs = require('fs');
const path = require('path');
const archive = require('../config/archiver.config.js');
const {doesFolderExist}= require('../utility/folder.utility.js');


function zipFolder(folderPath, outputPath) {
  const outputFilePath = path.resolve(outputPath);
    
  return new Promise((resolve, reject) => {
    const resolvedFolderPath = path.resolve(folderPath);
    doesFolderExist(resolvedFolderPath).then(() => {

      const folderName = path.parse(resolvedFolderPath).base;

      const output = fs.createWriteStream(outputFilePath);

      archive.pipe(output);
      archive.directory(resolvedFolderPath, folderName);
      archive.finalize();

      output.on('close', () => {
        resolve(outputFilePath);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = {
  zipFolder
};