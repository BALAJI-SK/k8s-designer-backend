---
to: <%= outputPath %>/<%= appName %>/.env
force: true
---
PORT=<%= port %>
<% if (Object.keys(envVariables).length > 0) { -%>
<% Object.entries(envVariables).forEach(([key, value]) => { -%>
<%= key.toUpperCase() %>: <%= value %>
<% }); -%>
<% } -%>