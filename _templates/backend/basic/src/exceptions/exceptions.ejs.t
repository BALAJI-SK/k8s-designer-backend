---
to: <%= outputPath %>/<%= name %>/src/exceptions/healthcheck.exceptions.js
force: true
---
class httpError extends Error {
  constructor(message, status) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

module.exports = httpError; 