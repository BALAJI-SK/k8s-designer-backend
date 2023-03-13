---
to:  "<%= (backends.length >= 1 ? (outputPath + '/' + appName + '/src/constants/apiEndPoints.js') : null) %>"
force: true
---
export const BACKEND_INFO = {
<% backends.forEach((backend) => { %>
  <%= backend.name %>: {
    BACKEND_URL: '<%= backend.url %>:<%= backend.port %>',
    PING_BACKEND: {
      baseURL: '<%= backend.url %>:<%= backend.port %>',
      url: '',
      method: 'ping',
    },
  },
<% }) %>
};