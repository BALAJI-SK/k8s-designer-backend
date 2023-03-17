const fs = require('fs').promises;
const path = require('path');
const mustache = require('mustache');
const {
  UTF8_ENCODING,
  OUTPUT_PATH,
  DOCKER_COMPOSE_FILE_NAME,
  DOCKER_COMPOSE_TEMPLATE_PATH,
} = require('../../../src/constants/app.constants');
const dockerComposeGenerator = require('../../../src/services/generators/docker-compose.js');
const ProjectDirectoryNotFoundException = require('../../../src/exceptions/ProjectDirectoryNotFoundException');

const projectId = 1;

const invalidProjectId = '999';

const sampleConfig = {
  name: 'frontend-application',
  image: 'nginx:latest',
  port: 3000,
  internalPort: 3000,
  environment: [
    { name: 'BACKEND_API_URL', value: 'http://backend-application/8080' },
    { name: 'DEBUG', value: true },
  ],
  replicas: 3,
};

describe('dockerComposeGenerator', () => {
  const mockStat = jest.fn();
  const mockReadFile = jest.fn();
  const mockWriteFile = jest.fn();
  const mockMustacheRender = jest.fn();

  beforeAll(() => {
    jest.spyOn(fs, 'stat').mockImplementation(mockStat);
    jest.spyOn(fs, 'readFile').mockImplementation(mockReadFile);
    jest.spyOn(fs, 'writeFile').mockImplementation(mockWriteFile);
    jest.spyOn(mustache, 'render').mockImplementation(mockMustacheRender);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should generate a docker-compose.yaml file', async () => {

    const projectDir = path.join(OUTPUT_PATH, projectId.toString());
    const dockerComposePath = path.join(projectDir, DOCKER_COMPOSE_FILE_NAME);

    const template = `version: '3'
            services:
            {{name}}:
                image: {{image}}
                ports:
                - "{{port}}:{{internalPort}}"
                envVariables:
            {{#envVariables}}
                {{name}}: "{{{value}}}"
            {{/envVariables}}
                deploy:
                replicas: {{replicas}}
            `;

    const expectedDockerComposeFile = `version: '3'
            services:
            frontend-application:
                image: nginx:latest
                ports:
                - "3000:3000"
                envVariables:
                BACKEND_API_URL: "http://backend-application/8080"
                DEBUG: "true"
                deploy:
                replicas: 3
            `;

    const mockedStats = { size: 1024 };
    mockStat.mockResolvedValue(mockedStats);
    mockReadFile.mockResolvedValue(template);
    mockMustacheRender.mockReturnValue(expectedDockerComposeFile);

    await dockerComposeGenerator(projectId, sampleConfig);

    expect(mockStat).toHaveBeenCalledWith(projectDir);
    expect(mockReadFile).toHaveBeenCalledWith(DOCKER_COMPOSE_TEMPLATE_PATH, UTF8_ENCODING);
    expect(mockWriteFile).toHaveBeenCalledWith(
      dockerComposePath,
      expectedDockerComposeFile,
      UTF8_ENCODING
    );
  });

  it('should throw a ProjectDirectoryNotFoundError if the project directory does not exist', async () => {

    mockStat.mockRejectedValue(
      new ProjectDirectoryNotFoundException(invalidProjectId)
    );

    await expect(
      dockerComposeGenerator(invalidProjectId, sampleConfig)
    ).rejects.toThrow(ProjectDirectoryNotFoundException);

    expect(mockReadFile).not.toHaveBeenCalled();
    expect(mockWriteFile).not.toHaveBeenCalled();
  });
});
