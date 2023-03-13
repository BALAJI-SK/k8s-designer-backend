---
to: <%= outputPath %>/<%= appName %>/.sequelize-<%= database.dbName %>
force: true
---
const path = require('path');

module.exports = {
  config: path.join(__dirname, 'database/config/config.js'),
  'migrations-path': path.join(__dirname, 'database/migrations/<%= database.dbName %>'),
  'seeders-path': path.join(__dirname, 'database/seeders/<%= database.dbName %>'),
  'models-path': path.join(__dirname, 'src/models')
};