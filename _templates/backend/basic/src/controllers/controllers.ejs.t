---
to: <%= outputPath %>/<%= name %>/src/controllers/healthcheck.controllers.js
force: true
---
const services = require('../services/healthcheck.services.js');
const httpError = require('../exceptions/healthcheck.exceptions.js');
const httpConstants = require('http2').constants;


const healthCheck = async (req, res) => {
  const status = services.healthCheck();
  res.status(httpConstants.HTTP_STATUS_OK).json({ status });
}

const getDetails = async (req, res) => {
  try {
    const fetchedDetails = await services.getDetails();
    if (fetchedDetails === undefined) throw new httpError('No data found', httpConstants.HTTP_STATUS_NOT_FOUND);
    res.status(httpConstants.HTTP_STATUS_OK).json(fetchedDetails);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
module.exports = { getDetails, healthCheck };