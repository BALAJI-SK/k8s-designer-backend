const archiver = require('archiver');

const archive = archiver('zip', {
  zlib: { level: 9 }
});

module.exports = archive;


