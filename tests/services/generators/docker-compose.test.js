const fs = require("fs").promises;
const path = require("path");
const {
  TEMPLATE_PATH,
  UTF8_ENCODING,
  OUTPUT_PATH,
  DOCKER_COMPOSE_FILE_NAME,
} = require("../../../src/constants/app.constants");
const dockerComposeGenerator = require("../../../src/services/generators/docker-compose.js");
const InvalidServiceTypeException = require("../../../src/exceptions/InvalidServiceTypeException");
const ProjectDirectoryNotFoundException = require("../../../src/exceptions/ProjectDirectoryNotFoundException");

const projectId = 1;

const invalidProjectId = "999";
const invalidServiceType = "INVALID_SERVICE_TYPE";

const frontendConfig = {
  name: "frontend-application",
  image: "nginx:latest",
  port: 3000,
  internalPort: 3000,
  envVariables: [
    { name: "BACKEND_API_URL", value: "http://backend-application/8080" },
    { name: "DEBUG", value: true },
  ],
  replicas: 3,
};

const backendConfig = {
  name: "backend-application",
  image: "nginx:latest",
  port: 8080,
  internalPort: 8080,
  envVariables: [
    {
      name: "DATABASE_URL",
      value: "postgres://user:password@localhost:5432/mydatabase",
    },
    { name: "JWT_SECRET", value: "randomjwtsecret" },
  ],
  replicas: 3,
};

describe("dockerComposeGenerator", () => {
  const mockStat = jest.fn();
  const mockReadFile = jest.fn();
  const mockWriteFile = jest.fn();

  beforeAll(() => {
    jest.spyOn(fs, "stat").mockImplementation(mockStat);
    jest.spyOn(fs, "readFile").mockImplementation(mockReadFile);
    jest.spyOn(fs, "writeFile").mockImplementation(mockWriteFile);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should generate a docker-compose.yaml file for frontend configurations", async () => {
    const serviceType = "FRONTEND";

    const templatePath = TEMPLATE_PATH[serviceType];
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

    await dockerComposeGenerator(projectId, serviceType, frontendConfig);

    expect(mockStat).toHaveBeenCalledWith(projectDir);
    expect(mockReadFile).toHaveBeenCalledWith(templatePath, UTF8_ENCODING);
    expect(mockWriteFile).toHaveBeenCalledWith(
      dockerComposePath,
      expectedDockerComposeFile,
      UTF8_ENCODING
    );
  });

  it("should generate a docker-compose.yaml file for backend configurations", async () => {
    const serviceType = "BACKEND";

    const templatePath = TEMPLATE_PATH[serviceType];
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
            backend-application:
                image: nginx:latest
                ports:
                - "8080:8080"
                envVariables:
                DATABASE_URL: "postgres://user:password@localhost:5432/mydatabase"
                JWT_SECRET: "randomjwtsecret"
                deploy:
                replicas: 3
            `;

    const mockedStats = { size: 1024 };
    mockStat.mockResolvedValue(mockedStats);

    mockReadFile.mockResolvedValue(template);

    await dockerComposeGenerator(projectId, serviceType, backendConfig);

    expect(mockStat).toHaveBeenCalledWith(projectDir);
    expect(mockReadFile).toHaveBeenCalledWith(templatePath, UTF8_ENCODING);
    expect(mockWriteFile).toHaveBeenCalledWith(
      dockerComposePath,
      expectedDockerComposeFile,
      UTF8_ENCODING
    );
  });

  it("should throw an InvalidServiceTypeError if the service type is invalid", async () => {
    await expect(
      dockerComposeGenerator(projectId, invalidServiceType, frontendConfig)
    ).rejects.toThrow(InvalidServiceTypeException);

    expect(mockStat).not.toHaveBeenCalled();
    expect(mockReadFile).not.toHaveBeenCalled();
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it("should throw a ProjectDirectoryNotFoundError if the project directory does not exist", async () => {
    const serviceType = "FRONTEND";

    mockStat.mockRejectedValue(
      new ProjectDirectoryNotFoundException(invalidProjectId)
    );

    await expect(
      dockerComposeGenerator(invalidProjectId, serviceType, frontendConfig)
    ).rejects.toThrow(ProjectDirectoryNotFoundException);

    expect(mockReadFile).not.toHaveBeenCalled();
    expect(mockWriteFile).not.toHaveBeenCalled();
  });
});
