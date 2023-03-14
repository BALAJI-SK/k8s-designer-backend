const Docker = require("dockerode");
const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const generateDockerImage = require("../../../src/services/generators/docker-image");
const getDirectoryNamesInsideFolder = require("../../../src/utility/getDirectoryNamesInsideFolder");

jest.mock("dockerode", () => {
  const mockStream = {
    on: jest.fn().mockImplementation(function (event, callback) {
      if (event === "data") {
        callback("data");
      } else if (event === "end") {
        callback();
      } else if (event === "error") {
        callback(new Error("Error while generating image"));
      }
    }),
  };

  const mockDocker = {
    buildImage: jest.fn().mockResolvedValue(mockStream),
  };

  return jest.fn(() => mockDocker);
});

jest.mock("../../../src/utility/getDirectoryNamesInsideFolder", () => {
  return jest.fn();
});

const projectId = 1;
const username = "username";

const mockBoilerplateNames = ["frontend", "backend"];

describe("generateDockerImage", () => {
  beforeEach(() => {
    getDirectoryNamesInsideFolder.mockResolvedValue(mockBoilerplateNames);
  });

  it("should generate a docker image successfully", async () => {
    await generateDockerImage(projectId, username);

    expect(docker.buildImage).toHaveBeenCalledWith(
      {
        context: expect.any(String),
        src: ["Dockerfile", "."],
      },
      { t: "username/frontend" }
    );

    expect(docker.buildImage).toHaveBeenCalledWith(
      {
        context: expect.any(String),
        src: ["Dockerfile", "."],
      },
      { t: "username/backend" }
    );
  });

  it("should throw an error if there is an error while generating the image", async () => {
    docker.buildImage.mockImplementation(() => {
      throw new Error("Error while generating image");
    });

    await expect(generateDockerImage(projectId, username)).rejects.toThrow(
      "Error while generating image"
    );
  });
});
