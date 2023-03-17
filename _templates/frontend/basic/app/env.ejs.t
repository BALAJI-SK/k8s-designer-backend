---
to: <%= outputPath %>/<%= name %>/.env
force: true
---
PORT=<%= containerPort %>
<%_ if(envVariables.length > 0 ) {_%>
<%_ envVariables.forEach((envVariable) => {_%>
<%= envVariable.name.toUpperCase() %>="<%= envVariable.value %>"
<%_ })_%>
<%_ }_%>