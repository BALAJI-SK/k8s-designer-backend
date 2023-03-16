const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const pushDockerImage = require('../../src/services/pushDockerImage');
const getDirectoryNamesInsideFolder = require('../../src/utility/getDirectoryNamesInsideFolder');

jest.mock('dockerode', () => {
  const mockStream = {
    on: jest.fn().mockImplementation(function (event, callback) {
      if (event === 'data') {
        callback('data');
      } else if (event === 'end') {
        callback();
      } else if (event === 'error') {
        callback(new Error('Error while pushing image'));
      }
    }),
  };

  const mockDocker = {
    getImage: jest.fn().mockReturnValue({
      push: jest.fn().mockResolvedValue(mockStream),
    }),
  };

  return jest.fn(() => mockDocker);
});

jest.mock('../../src/utility/getDirectoryNamesInsideFolder', () => {
  return jest.fn();
});

const projectId = 1;
const username = 'username';
const password = 'password';
const email = 'email';
const serverAddress = 'serverAddress';

const mockBoilerplateNames = ['frontend', 'backend'];

describe('pushDockerImage', () => {
  beforeEach(() => {
    getDirectoryNamesInsideFolder.mockResolvedValue(mockBoilerplateNames);
  });

  it('should push a docker image successfully', async () => {
    await pushDockerImage(projectId, username, password, email, serverAddress);

    expect(docker.getImage).toHaveBeenCalledWith('username/frontend');
    expect(docker.getImage).toHaveBeenCalledWith('username/backend');

    expect(docker.getImage().push).toHaveBeenCalledWith({
      authconfig: {
        username,
        password,
        email,
        serveraddress: serverAddress,
      },
    });
  });

  it('should throw an error if there is an error while pushing the image', async () => {
    docker.getImage.mockReturnValueOnce({
      push: jest.fn().mockImplementation(() => {
        throw new Error('Error while pushing image');
      }),
    });

    await expect(
      pushDockerImage(projectId, username, password, email, serverAddress)
    ).rejects.toThrow('Error while pushing image');
  });
});
