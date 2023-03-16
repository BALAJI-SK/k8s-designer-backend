const fs = require("fs").promises;

const getDirectories = async (dir) => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });

  return dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

module.exports = getDirectories;
