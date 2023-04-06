const process = require('process');
const { resolve } = require('path');
const generateForExisting = require('../../cli/services/generateForExisting.js');
const generateFromConfig = require('../../cli/services/generateFromConfig.js');

jest.mock('colors', () => ({
  red: jest.fn()
}));
jest.mock('../../cli/services/generateFromConfig.js', () => (
  jest.fn()
));
jest.mock('../../cli/services/generateForExisting.js', () => (
  jest.fn()
));
jest.mock('process', () => ({
  exit: jest.fn(),
  cwd: jest.fn().mockReturnValue('path/to/cwd'),
  argv: []
}));

describe('cli', () => {
  beforeEach(() => {
    process.argv = ['node', 'cli.js'];
  });
  it('should call cli.fatal when both filepath and dockerComposePath are passed', async () => {
    jest.doMock('cli', () => ({
      setUsage: jest.fn(),
      parse: jest.fn().mockReturnValue({
        filepath: 'path/to/file',
        projectName: 'project-name',
        dockerComposePath: 'path/to/docker-compose',
        isOffline: false
      }),
      fatal: jest.fn()
    }));
    process.argv.push('--filepath', 'path/to/file', '--dockerComposePath', 'path/to/docker-compose');
    jest.isolateModules(() => {
      require('../../cli/cli.js');
    });
    await expect(generateForExisting).not.toBeCalled();
    await expect(generateFromConfig).not.toBeCalled();
  });
  it('should call generateFromConfig with the correct arguments when filepath is passed', async () => {
    jest.doMock('cli', () => ({
      setUsage: jest.fn(),
      parse: jest.fn().mockReturnValue({
        filepath: './config.json',
        projectName: 'project-name',
        dockerComposePath: null,
        isOffline: false
      }),
      fatal: jest.fn()
    }));
    generateFromConfig.mockResolvedValue();
    const mockService = {
      services: [
        {
          service_type: 'FrontEnd',
          configurations: {
            name: 'frontend',
            port: 3000
          },
          imageRepository: {
            username: 'username',
            password: 'password'
          },
          customEnv: {
            ENV_VAR: 'value'
          },
          connected_service: []
        },
      ]
    };
    
    process.argv.push('--filepath', './config.json');
    const mockSerciceDataPath = resolve(process.cwd(), './config.json');
    jest.doMock(mockSerciceDataPath, () => (mockService), {virtual: true});
    jest.isolateModules(() => {
      require('../../cli/cli.js');
    });
    await expect(generateFromConfig).toHaveBeenCalledWith(mockService, 'project-name', false);
    expect(process.exit).toBeCalledWith(0);
  });
  it('should call generateForExisting with the correct arguments when dockerComposePath is passed', async () => {
    jest.doMock('cli', () => ({
      setUsage: jest.fn(),
      parse: jest.fn().mockReturnValue({
        filepath: null,
        projectName: 'project-name',
        dockerComposePath: 'path/to/docker-compose',
        isOffline: false
      }),
      fatal: jest.fn()
    }));
    generateForExisting.mockResolvedValue();
    process.argv.push('--dockerComposePath', 'path/to/docker-compose');
    
    jest.isolateModules(() => {
      require('../../cli/cli.js');
    });

    await expect(generateForExisting).toHaveBeenCalledWith('path/to/docker-compose');
    expect(process.exit).toBeCalledWith(0);
  });
  it('should terminate when generateFromConfig throws an error', async () => {
    jest.doMock('cli', () => ({
      setUsage: jest.fn(),
      parse: jest.fn().mockReturnValue({
        filepath: './config.json',
        projectName: 'project-name',
        dockerComposePath: null,
        isOffline: false
      }),
      fatal: jest.fn()
    }));
    generateFromConfig.mockRejectedValue(new Error('error'));
    
    process.argv.push('--filepath', './config.json');
    const mockSerciceDataPath = resolve(process.cwd(), './config.json');
    jest.doMock(mockSerciceDataPath, () => ({}), {virtual: true});
    jest.isolateModules(() => {
      require('../../cli/cli.js');
    });
    expect(generateFromConfig).rejects.toThrow('error');
  });
  it('should terminate when generateForExisting throws an error', async () => {
    jest.doMock('cli', () => ({
      setUsage: jest.fn(),
      parse: jest.fn().mockReturnValue({
        filepath: null,
        projectName: 'project-name',
        dockerComposePath: 'path/to/docker-compose',
        isOffline: false
      }),
      fatal: jest.fn()
    }));
    generateForExisting.mockRejectedValue(new Error('error'));
    
    process.argv.push('--dockerComposePath', 'path/to/docker-compose');
    jest.isolateModules(() => {
      require('../../cli/cli.js');
    });
    expect(generateForExisting).rejects.toThrow('error');
  });
});
