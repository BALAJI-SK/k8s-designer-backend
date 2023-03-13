---
to: <%= outputPath %>/<%= appName %>/src/models/<%= database.dbName %>/<%= database.model.name %>.js
force: true
---
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class <%= database.model.name %> extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  <%= database.model.name %>.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: '<%= database.model.name %>',
  });
  return <%= database.model.name %>;
};