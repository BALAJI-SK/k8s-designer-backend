---
to: <%= outputPath %>/<%= name %>/index.js
force: true
---
const express = require('express');
const routes =require('./src/routes/healthcheck.routes.js');

const app = express();
const PORT = process.env.PORT || <%= port %>;

<% if(frontends.length >0) {-%>
const cors = require('cors');
const corsOrigins = [
  <% frontends.map(frontend => { %>
  'http://<%= frontend.name + ':' + frontend.port %>',
  <% }); %>
];

app.use(cors({
  origin: corsOrigins,
}));
<%}-%>

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

