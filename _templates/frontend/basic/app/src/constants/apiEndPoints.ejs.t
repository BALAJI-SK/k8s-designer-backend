---
to:  "<%= (backends.length >= 1 ? (outputPath + '/' + name + '/src/constants/apiEndPoints.js') : null) %>"
force: true
---
export const BACKEND_INFO = {
<% backends.forEach((backend) => { %>
  <%= backend.name %>: {
    BACKEND_URL: '/<%= backend.name %>',
    PING_BACKEND: {
      baseURL: '/<%= backend.name %>',
      url: 'api/ping',
      method: 'get',
    },
  },
<% }) %>
};