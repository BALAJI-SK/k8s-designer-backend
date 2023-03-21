const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const pushDockerImage = require('../../src/services/pushDockerImage');

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
      remove: jest.fn(),
    }),
  };

  return jest.fn(() => mockDocker);
});

const config = {
  frontend: [
    {
      name: 'frontend',
      username: 'test',
      token: 'token',
      email: 'test@test.com',
      repositoryImageAddress: 'test.com',
    },
  ],

  backend: [
    {
      name: 'backend',
      username: 'test',
      token: 'token',
      email: 'test@test.com',
      repositoryImageAddress: 'test.com',
    },
  ],

  database: [],
};

describe('pushDockerImage', () => {
  it('should push a docker image successfully', async () => {
    await pushDockerImage(config);

    expect(docker.getImage).toHaveBeenCalledWith('test/frontend');
    expect(docker.getImage).toHaveBeenCalledWith('test/backend');

    const {
      username: frontendUsername,
      token: frontendPassword,
      email: frontendEmail,
      repositoryImageAddress: frontendServerAddress,
    } = config.frontend[0];

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
      token: backendPassword,
      email: backendEmail,
      repositoryImageAddress: backendServerAddress,
    } = config.backend[0];

    expect(docker.getImage().push).toHaveBeenCalledWith({
      authconfig: {
        username: backendUsername,
        password: backendPassword,
        email: backendEmail,
        serveraddress: backendServerAddress,
      },
    });
  });

  it('should throw an error if there is an error while pushing the image', async () => {
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
});
