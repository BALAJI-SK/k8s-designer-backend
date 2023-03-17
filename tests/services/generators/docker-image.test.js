const Docker = require("dockerode");
const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const generateDockerImage = require("../../../src/services/generators/docker-image");

jest.mock('dockerode', () => {
  const mockStream = {
    on: jest.fn().mockImplementation(function (event, callback) {
      if (event === 'data') {
        callback('data');
      } else if (event === 'end') {
        callback();
      } else if (event === 'error') {
        callback(new Error('Error while generating image'));
      }
    }),
  };

  const mockDocker = {
    buildImage: jest.fn().mockResolvedValue(mockStream),
  };

  return jest.fn(() => mockDocker);
});

const projectId = 1;

const config = {
  frontend: [
    {
      name: "frontend",
      username: "test",
    },
  ],

  backend: [
    {
      name: "backend",
      username: "test",
    },
  ],

  database: [],
};

describe("generateDockerImage", () => {
  it("should generate a docker image successfully", async () => {
    await generateDockerImage(projectId, config);

    expect(docker.buildImage).toHaveBeenCalledWith(
      {
        context: expect.any(String),
        src: ['Dockerfile', '.'],
      },
      { t: "test/frontend" }
    );

    expect(docker.buildImage).toHaveBeenCalledWith(
      {
        context: expect.any(String),
        src: ['Dockerfile', '.'],
      },
      { t: "test/backend" }
    );
  });

  it('should throw an error if there is an error while generating the image', async () => {
    docker.buildImage.mockImplementation(() => {
      throw new Error('Error while generating image');
    });

    await expect(generateDockerImage(projectId, config)).rejects.toThrow(
      "Error while generating image"
    );
  });
});
