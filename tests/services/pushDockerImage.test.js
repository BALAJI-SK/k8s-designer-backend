const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const pushDockerImage = require('../../src/services/pushDockerImage');

jest.mock('dockerode', () => {
  const mockStream = {
    on: jest.fn().mockImplementation(function (event, callback) {
      if (event === 'data') {
        callback('{"data": "data"}');
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
      remove: jest.fn(),
    }),
  };

  return jest.fn(() => mockDocker);
});

const config = [
  {
    name: 'frontend',
    username: 'test',
    password: 'test',
    email: 'email',
    serverAddress: 'test',
    imageName: 'test/frontend',
  },
  {
    name: 'backend',
    username: 'test',
    password: 'test',
    email: 'email',
    serverAddress: 'test',
    imageName: 'test/backend',
  },
];

describe('pushDockerImage', () => {
  it('should push a docker image successfully', async () => {
    await pushDockerImage(config);

    expect(docker.getImage).toHaveBeenCalledWith('test/frontend');
    expect(docker.getImage).toHaveBeenCalledWith('test/backend');

    const {
      username: frontendUsername,
      password: frontendPassword,
      email: frontendEmail,
      serverAddress: frontendServerAddress,
    } = config[0];

    expect(docker.getImage().push).toHaveBeenCalledWith({
      authconfig: {
        username: frontendUsername,
        password: frontendPassword,
        email: frontendEmail,
        serveraddress: frontendServerAddress,
      },
    });

    const {
      username: backendUsername,
      password: backendPassword,
      email: backendEmail,
      serverAddress: backendServerAddress,
    } = config[1];

    expect(docker.getImage().push).toHaveBeenCalledWith({
      authconfig: {
        username: backendUsername,
        password: backendPassword,
        email: backendEmail,
        serveraddress: backendServerAddress,
      },
    });
  });

  it('should throw an error if there is an error while getting the image', async () => {
    docker.getImage.mockReturnValueOnce({
      push: jest.fn().mockImplementation(() => {
        throw new Error('Error while pushing image');
      }),
      remove: jest.fn(),
    });

    await expect(pushDockerImage(config)).rejects.toThrow(
      'Error while pushing image'
    );
  });
  it('should throw an error if there is an error while pushing the image', async () => {
    docker.getImage.mockReturnValueOnce({
      push: jest.fn().mockResolvedValue({
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'data') {
            callback('{"error": "Error while pushing image"}');
          } else if (event === 'end') {
            callback();
          } else if (event === 'error') {
            callback(new Error('Error while pushing image'));
          }
        }),
      }),
      remove: jest.fn(),
    });

    pushDockerImage(config).catch((err) => {
      expect(err).toBe('Failed to push test/frontend: Error while pushing image');
    });
  });
  it('should throw an error if there is an error while removing the image', async () => {
    docker.getImage.mockReturnValueOnce({
      push: jest.fn().mockResolvedValue({
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'data') {
            callback('{"data": "data"}');
          } else if (event === 'end') {
            callback();
          } else if (event === 'error') {
            callback(new Error('Error while pushing image'));
          }
        }),
      }),
      remove: jest.fn().mockImplementation((options, callback) => {
        callback(new Error('Error while removing image'));
      }),
    });

    pushDockerImage(config).catch((err) => {
      expect(err).toBe('Error while removing image');
    });
  });
});
