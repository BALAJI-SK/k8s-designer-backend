---
to: <%= outputPath %>/<%= name %>/package.json
force: true
---
{
  "name": "<%= name %>",
  "version": "1.0.0",
  "description": "Standalone Backend Boilerplate using NodeJS and Express",
  "main": "index.js",
  "scripts": {
    "test": "jest",
    "test-coverage": "concurrently 'npx jest tests' 'npx jest --coverage'",
    <%_ if(databases.length === 0) { _%>
    "start": "node index.js",
    <%_ } _%>
    "lint": "npx eslint --fix .",
    <%_ databases.forEach((database) => { _%>
    "sequelize:<%= database.dbName %>:create": "sequelize --options-path ./.sequelize-<%= database.dbName %> --env <%= database.dbName %> db:create",
    "sequelize:<%= database.dbName %>:migrate": "sequelize --options-path ./.sequelize-<%= database.dbName %> --env <%= database.dbName %> db:migrate",
    "sequelize:<%= database.dbName %>:migrate:undo": "sequelize --options-path ./.sequelize-<%= database.dbName %> --env <%= database.dbName %> db:migrate:undo",
    "sequelize:<%= database.dbName %>:seed:all": "sequelize --options-path ./.sequelize-<%= database.dbName %> --env <%= database.dbName %> db:seed:all",
    <%_ }) _%>
    <%_ if(databases.length > 0) { _%>
    "start": "<% databases.forEach((database) => { %> npm run sequelize:<%= database.dbName %>:migrate && npm run sequelize:<%= database.dbName %>:seed:all && <% }) %> npm run nodemon",
    <%_ } _%>
    "nodemon": "nodemon index.js"
  },
  "keywords": [
    "microservice",
    "backend",
    "NodeJS",
    "Express"
  ],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "concurrently": "^7.6.0",
    "nodemon": "^2.0.21",
    <%_ if(databases.length > 0) { _%>
    "sequelize-cli": "^6.6.0",
    <%_ } _%>
    "eslint": "^8.33.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    <%_ if(databases.length > 0) { _%>
    "pg": "^8.9.0",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.29.0",
    <%_ } _%>
    "cors": "^2.8.5"
  }
}