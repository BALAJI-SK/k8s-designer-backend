---
to:  "<%= (databases.length > 0 ? (outputPath + '/' + appName + '/database/config/config.js') : null) %>"
force: true
---
<% if(databases.length > 0) {%>
module.exports = {
  "development": {
    "databases": {
      <%_ databases.forEach((database, index) => { _%>
    "<%= database.dbName %>": {
      "username": "<%= database.dbUser %>",
      "password": "<%= database.dbPassword %>",
      "database": "<%= database.dbName %>",
      "host": "<%= database.dbHost %>",
      "dialect": "postgres",
      "port": "<%= database.dbPort %>"
    }<% if(index < databases.length - 1) { %>,<% } %>
    <%_ }) _%>
    }
  },
  "test": {
    "databases": {
    <%_ databases.forEach((database, index) => { _%>
    "<%= database.dbName %>": {
      "username": "<%= database.dbUser %>",
      "password": "<%= database.dbPassword %>",
      "database": "<%= database.dbName %>",
      "host": "<%= database.dbHost %>",
      "dialect": "postgres",
      "port": "<%= database.dbPort %>"
    }<% if(index < databases.length - 1) { %>,<% } %>
    <%_ }) _%>
    }
  },
  "production": {
    "databases": {
    <%_ databases.forEach((database, index) => { _%>
    "<%= database.dbName %>": {
      "username": "<%= database.dbUser %>",
      "password": "<%= database.dbPassword %>",
      "database": "<%= database.dbName %>",
      "host": "<%= database.dbHost %>",
      "dialect": "postgres",
      "port": "<%= database.dbPort %>"
    }<% if(index < databases.length - 1) { %>,<% } %>
    <%_ }) _%>
    }
  },
  <%_ databases.forEach((database, index) => { _%>
  "<%= database.dbName %>": {
    "username": "<%= database.dbUser %>",
    "password": "<%= database.dbPassword %>",
    "database": "<%= database.dbName %>",
    "host": "<%= database.dbHost %>",
    "dialect": "postgres",
    "port": "<%= database.dbPort %>"
    }<% if(index < databases.length - 1) { %>,<% } %>
  <%_ }) _%>
}
<% } %>