---
to:  "<%= (databases.length > 0 ? (outputPath + '/' + name + '/database/config/config.js') : null) %>"
force: true
---
<% if(databases.length > 0) {%>
module.exports = {
  "development": {
    "databases": {
      <%_ databases.forEach((database, index) => { _%>
    "<%= database.name %>": {
      "username": "<%= database.dbUser %>",
      "password": "<%= database.dbPassword %>",
      "database": "<%= database.name %>",
      "host": "<%= database.dbHost %>",
      "dialect": "postgres",
      "port": "<%= database.port %>"
    }<% if(index < databases.length - 1) { %>,<% } %>
    <%_ }) _%>
    }
  },
  "test": {
    "databases": {
    <%_ databases.forEach((database, index) => { _%>
    "<%= database.name %>": {
      "username": "<%= database.dbUser %>",
      "password": "<%= database.dbPassword %>",
      "database": "<%= database.name %>",
      "host": "<%= database.dbHost %>",
      "dialect": "postgres",
      "port": "<%= database.port %>"
    }<% if(index < databases.length - 1) { %>,<% } %>
    <%_ }) _%>
    }
  },
  "production": {
    "databases": {
    <%_ databases.forEach((database, index) => { _%>
    "<%= database.name %>": {
      "username": "<%= database.dbUser %>",
      "password": "<%= database.dbPassword %>",
      "database": "<%= database.name %>",
      "host": "<%= database.dbHost %>",
      "dialect": "postgres",
      "port": "<%= database.port %>"
    }<% if(index < databases.length - 1) { %>,<% } %>
    <%_ }) _%>
    }
  },
  <%_ databases.forEach((database, index) => { _%>
  "<%= database.name %>": {
    "username": "<%= database.dbUser %>",
    "password": "<%= database.dbPassword %>",
    "database": "<%= database.name %>",
    "host": "<%= database.dbHost %>",
    "dialect": "postgres",
    "port": "<%= database.port %>",
    }<% if(index < databases.length - 1) { %>,<% } %>
  <%_ }) _%>
}
<% } %>