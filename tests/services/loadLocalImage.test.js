const { spawn } = require('child_process');
const loadLocalImage = require('../../src/services/loadLocalImage');

jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

describe('loadLocalImage', () => {
  const configurations = {
    microservice1: [
      {
        image: 'image1',
      },
    ],
    microservice2: [
      {
        image: 'image2',
      },
    ],
    microservice3: []
  };
  it('should resolve if all images are loaded successfully', async () => {
    spawn.mockReturnValue({
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          callback(0);
        }
      }),
    });
    await expect(loadLocalImage(configurations)).resolves.toEqual([0,0]);
  });

  it('should reject if at least one image is not loaded successfully', async () => {
    spawn.mockReturnValue({
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          callback(1);
        }
      }),
    });
    await expect(loadLocalImage(configurations)).rejects.toEqual('Error loading image');
  });
});
