const express = require('express');
const routes = require('./src/routes/index.routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes.projectRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
