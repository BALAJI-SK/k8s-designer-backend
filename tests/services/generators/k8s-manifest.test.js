const k8sManifestGenerator = require('../../../src/services/generators/k8s-manifest');

let mockSpawn = {};
let mockWriteStream = {};

jest.mock('fs', () => ({
  createWriteStream: () => mockWriteStream,
}));

jest.mock('child_process', () => ({
  spawn: () => mockSpawn,
}));

describe('k8sManifestGenerator', () => {
  it('should generate a k8s-manifest.yaml file', async () => {
    mockSpawn = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          callback(0);
        }
      }),
      stdout: {
        pipe: jest.fn(),
      },
      stderr: {
        on: jest.fn(),
      },
    };

    const code = await k8sManifestGenerator(1);
    expect(code).toBe(0);
  });

  it('should throw error when the k8s-manifest is not generated', async () => {
    mockSpawn = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          callback(1);
        }
      }),
      stdout: {
        pipe: jest.fn(),
      },
      stderr: {
        on: jest.fn(),
      },
    };

    try {
      await k8sManifestGenerator(1);
    } catch (e) {
      expect(e).toBe(1);
    }
  });

  it('should throw an error if docker-compose.yaml file does not exist', async () => {
    mockSpawn = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          callback(1);
        }
      }),
      stdout: {
        pipe: jest.fn().mockImplementation(() => {
          throw new Error('error');
        }),
      },
    };

    try {
      await k8sManifestGenerator(1);
    } catch (e) {
      expect(e.message).toBe('error');
    }
  });
});
