const mustache = require('mustache');
const fs = require('fs').promises;
const path = require('path');
const {
  DOCKER_COMPOSE_TEMPLATE_PATH,
  UTF8_ENCODING,
  OUTPUT_PATH,
  DOCKER_COMPOSE_FILE_NAME
} = require('../../constants/app.constants');
const ProjectDirectoryNotFoundException = require('../../exceptions/ProjectDirectoryNotFoundException');

const dockerComposeGenerator = async (projectId, config) => {

  const projectDir = path.join(OUTPUT_PATH, projectId.toString());

  try {
    await fs.stat(projectDir);
  } catch (err) {
    throw new ProjectDirectoryNotFoundException(projectDir);
  }

  const dockerComposePath = path.join(projectDir, DOCKER_COMPOSE_FILE_NAME);

  const template = await fs.readFile(DOCKER_COMPOSE_TEMPLATE_PATH, UTF8_ENCODING);
  const dockerComposeFile = mustache.render(template, config);

  await fs.writeFile(dockerComposePath, dockerComposeFile, UTF8_ENCODING);
};

module.exports = dockerComposeGenerator;
