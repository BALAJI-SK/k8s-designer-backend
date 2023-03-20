---
to:  "<%= (databases.length > 0 ? (outputPath + '/' + name + '/src/models/index.js') : null) %>"
force: true
---
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../database/config/config.js')[env];
const db = {};
const databases = Object.keys(config.databases);

for(let i = 0; i < databases.length; ++i) {
    let database = databases[i];
    let dbPath = config.databases[database];
    db[database] = new Sequelize( dbPath.database, dbPath.username, dbPath.password, dbPath );
}


<%_ databases.forEach((database) => { _%>
fs
    .readdirSync(__dirname + '/<%= database.name %>')
    .filter(file =>
        (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js'))
    .forEach(file => {
        const model = require(path.join(__dirname + '/<%= database.name %>', file))(db.<%= database.name %>, Sequelize.DataTypes);  
        db[model.name] = model;
    });
<%_ }) _%>


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


module.exports = db;
