---
to: <%= outputPath %>/<%= appName %>/database/seeders/<%= database.dbName %>/seed-data.js
force: true
---
/* eslint-disable no-unused-vars */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('<%= database.model.tableName %>', [
      <%_ database.model.data.forEach((data) => { _%>
      {
        name: '<%= data %>',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      <%_ }) _%>
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('<%= database.model.tableName %>', null, {});
  }
};
