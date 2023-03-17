const path = require('path');

require('dotenv').config();

const PROJECT_ROOT = process.env.PROJECT_ROOT || path.join(__dirname, '../..');
const TEMPLATE_PATH = {
  FRONTEND: path.join(
    PROJECT_ROOT,
    'src/templates/docker-compose/frontend.mustache'
  ),

  BACKEND: path.join(
    PROJECT_ROOT,
    'src/templates/docker-compose/backend.mustache'
  ),
};
const DOCKER_COMPOSE_TEMPLATE_PATH = 'src/templates/docker-compose/docker-compose.mustache';

const UTF8_ENCODING = 'utf8';
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'tmp');

const DOCKER_COMPOSE_FILE_NAME = 'docker-compose.yaml';
const K8S_MANIFEST_FILE_NAME = 'k8s-manifest.yaml';

module.exports = {
  PROJECT_ROOT,
  TEMPLATE_PATH,
  DOCKER_COMPOSE_TEMPLATE_PATH,
  UTF8_ENCODING,
  OUTPUT_PATH,
  DOCKER_COMPOSE_FILE_NAME,
  K8S_MANIFEST_FILE_NAME,
};
