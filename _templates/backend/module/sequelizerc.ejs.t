---
to: <%= outputPath %>/<%= name %>/.sequelize-<%= database.name %>
force: true
---
const path = require('path');

module.exports = {
  config: path.join(__dirname, 'database/config/config.js'),
  'migrations-path': path.join(__dirname, 'database/migrations/<%= database.name %>'),
  'seeders-path': path.join(__dirname, 'database/seeders/<%= database.name %>'),
  'models-path': path.join(__dirname, 'src/models')
};