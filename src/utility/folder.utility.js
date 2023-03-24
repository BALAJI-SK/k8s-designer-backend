const util = require('util');
const fs = require('fs');

const doesFolderExist=(resolvedFolderPath)=> {
  const exists = util.promisify(fs.access);
  const doesFolderExist = exists(resolvedFolderPath);
  return doesFolderExist;
};

module.exports = {
  doesFolderExist
};