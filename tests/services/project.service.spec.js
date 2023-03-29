const services = require('../../src/services/project.service.js');
const projectRepository = require('../../src/repositories/project.repositories');
const { generateBoilerplate } = require('../../src/services/generators/generateBoilerplate.service.js');
const dockerComposeGenerator = require('../../src/services/generators/docker-compose.js');
const {generateDockerImage} = require('../../src/services/generators/docker-image.js');
const pushDockerImage = require('../../src/services/pushDockerImage.js');
const k8sManifestGenerator = require('../../src/services/generators/k8s-manifest.js');
const repositoryServiceObj = require('../../src/utility/projects.utils.js');
const { zipFolder } = require('../../src/services/zipping.service.js');
const { OUTPUT_PATH, DOCKER_COMPOSE_FILE_NAME, K8S_MANIFEST_FILE_NAME } = require('../../src/constants/app.constants.js');
const path = require('path');
const sampleConfigurations = {
  FrontEnd: {
    name: 'frontend',
  }
};
const projectId = 1;
jest.mock('../../src/utility/generators.utils.js', () => {
  return {
    getConfigurations: jest.fn().mockReturnValue(sampleConfigurations),
    getBoilerplatesConfig: jest.fn().mockReturnValue(sampleConfigurations),
  };
});
jest.mock('../../src/services/generators/generateBoilerplate.service.js', () => {
  return {
    generateBoilerplate: jest.fn(),
  };
});
jest.mock('../../src/services/generators/docker-compose.js', () => {
  return jest.fn();
});
jest.mock('../../src/services/generators/docker-image.js', () => {
  return {
    generateDockerImage: jest.fn().mockResolvedValue(),
  };
});
jest.mock('../../src/services/loadLocalImage.js', () => {
  return jest.fn().mockResolvedValue();
});
jest.mock('../../src/services/pushDockerImage.js', () => {
  return jest.fn().mockResolvedValue();
});
jest.mock('../../src/services/generators/k8s-manifest.js', () => {
  return jest.fn();
});
jest.mock('../../src/services/zipping.service.js', () => {
  return {
    zipFolder: jest.fn(),
  };
});
const mockreq = {body:{'services':[
  {
    'service_type': 'FrontEnd',
    'configurations':{
      'reactVersion': '2.08',
      'port':'5432',
      'numberOfReplicas':5,
      'name':'React Todo App'
    },
    'customEnv':{
      'field': 'port',
      'value':'2345'
    }
  },
  {
    'service_type': 'BackEnd',
    'configurations':{
      'reactVersion': '2.08',
      'port':'5432',
      'numberOfReplicas':5,
      'name':'React Todo App'
    },
    'customEnv':{
      'field': 'port',
      'value':'2345'
    }
  }
]}};
describe('microservices service testing', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it('should populate microservice table ', async () => {
    jest.spyOn(projectRepository,'create').mockResolvedValueOnce({
      'id':projectId,
      'userId':4
    });
    jest.spyOn(repositoryServiceObj,'FrontEnd').mockResolvedValueOnce({
      'id':3,
    });
    jest.spyOn(repositoryServiceObj,'BackEnd').mockResolvedValueOnce({
      'id':4,
    });
    // eslint-disable-next-line no-unused-vars
    const mockres = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const result = await services.generateProject(mockreq.body);
    expect(result).toEqual(path.join(OUTPUT_PATH, `${projectId}.zip`));
  });
  it('should call the generators with correct parameters', async () => {
    process.env.OFFLINE_ENABLED = 'false';
    jest.spyOn(projectRepository,'create').mockResolvedValueOnce({
      'id':projectId,
      'userId':4
    });
    jest.spyOn(repositoryServiceObj,'FrontEnd').mockResolvedValueOnce({
      'id':3,
    });
    jest.spyOn(repositoryServiceObj,'BackEnd').mockResolvedValueOnce({
      'id':4,
    });
    await services.generateProject(mockreq.body);
    const folderPath = path.join(OUTPUT_PATH, projectId.toString());
    const zipPath = path.join(OUTPUT_PATH, `${projectId}.zip`);
    const projectDir = path.join(OUTPUT_PATH, projectId.toString());
    const dockerComposePath = path.join(projectDir, DOCKER_COMPOSE_FILE_NAME);
    const k8sManifestPath = path.join(projectDir, K8S_MANIFEST_FILE_NAME);
    expect(generateBoilerplate).toHaveBeenCalledWith(projectId, 'FrontEnd', sampleConfigurations);
    expect(dockerComposeGenerator).toHaveBeenCalledWith(projectId, sampleConfigurations);
    expect(generateDockerImage).toHaveBeenCalledWith(projectId, sampleConfigurations);
    expect(pushDockerImage).toHaveBeenCalledWith(sampleConfigurations);
    expect(k8sManifestGenerator).toHaveBeenCalledWith(dockerComposePath, k8sManifestPath);
    expect(zipFolder).toHaveBeenCalledWith(folderPath, zipPath);
  });
});




const projectServiceConfig = require('../../src/repositories/projectServiceConfig.repositories');
const frontendService = require('../../src/repositories/frontendService.repositories');
const backendService = require('../../src/repositories/backendService.repositories');
const databaseService = require('../../src/repositories/databaseService.repositories');
const envVariables = require('../../src/repositories/envVariables.repositories');
const imageService = require('../../src/repositories/imageService.repositories');

jest.mock('../../src/repositories/projectServiceConfig.repositories');
jest.mock('../../src/repositories/frontendService.repositories');
jest.mock('../../src/repositories/backendService.repositories');
jest.mock('../../src/repositories/databaseService.repositories');
jest.mock('../../src/repositories/envVariables.repositories');
jest.mock('../../src/repositories/imageService.repositories');

describe('getLatestProject', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the correct data for a FrontEnd service', async () => {
    // Set up mock functions and data
    jest.spyOn(projectRepository,'getLatestProject').mockResolvedValueOnce([{
      'id':projectId,
      'userId':4
    }]);
    projectServiceConfig.getServices.mockResolvedValue([{ id: 2, serviceType: 'FrontEnd' }]);
    frontendService.getConfigurations.mockResolvedValue([{ port: 8080, numberOfReplicas: 2, name: 'frontend' }]);
    envVariables.getConnectedServices.mockResolvedValue([{ field: 'BACKEND_URL' }]);
    envVariables.getVariables.mockResolvedValue([{ field: 'API_KEY', value: '12345' }]);
    imageService.getImageRepo.mockResolvedValue([{ imageRepositoryUrl: 'https://example.com/repo', username: 'user', email: 'user@example.com', imageRepositoryToken: 'token' }]);
    
    // Call the function with a mock user ID
    const result = await services.getLatestProject(1);
    
    // Assert that the result is correct
    expect(result).toEqual([{ service_type: 'FrontEnd', configurations: { port: 8080, numberOfReplicas: 2, name: 'frontend' }, connectedServices: ['BACKEND_URL'], customEnv: { API_KEY: '12345' }, imageRepository: { repositoryImageAddress: 'https://example.com/repo', username: 'user', email: 'user@example.com', token: 'token' } }]);
    
    // Assert that the mock functions were called with the correct arguments
    expect(projectRepository.getLatestProject).toHaveBeenCalledWith(1);
    expect(projectServiceConfig.getServices).toHaveBeenCalledWith(1);
    expect(frontendService.getConfigurations).toHaveBeenCalledWith(2);
    expect(envVariables.getConnectedServices).toHaveBeenCalledWith(2);
    expect(envVariables.getVariables).toHaveBeenCalledWith(2);
    expect(imageService.getImageRepo).toHaveBeenCalledWith(2);
  });
  it('should return the correct data for a BackEnd service', async () => {
    jest.spyOn(projectRepository,'getLatestProject').mockResolvedValueOnce([{
      'id':projectId,
      'userId':4
    }]);
    projectServiceConfig.getServices.mockResolvedValue([{ id: 2, serviceType: 'BackEnd' }]);
    backendService.getConfigurations.mockResolvedValue([{ port: 8080, numberOfReplicas: 2, name: 'backend' }]);
    envVariables.getConnectedServices.mockResolvedValue([{ field: 'DATABASE_URL' }]);
    envVariables.getVariables.mockResolvedValue([{ field: 'API_KEY', value: '12345' }]);
    imageService.getImageRepo.mockResolvedValue([{ imageRepositoryUrl: 'https://example.com/repo', username: 'user',  email: 'user@example.com', imageRepositoryToken: 'token' }]);

    const result = await services.getLatestProject(1);

    // Assert that the result is correct
    expect(result).toEqual([{ service_type: 'BackEnd', configurations: { port: 8080, numberOfReplicas: 2, name: 'backend' }, connectedServices: ['DATABASE_URL'], customEnv: { API_KEY: '12345' }, imageRepository: { repositoryImageAddress: 'https://example.com/repo', username: 'user', email: 'user@example.com', token: 'token' } }]);

    // Assert that the mock functions were called with the correct arguments
    expect(projectRepository.getLatestProject).toHaveBeenCalledWith(1);
    expect(projectServiceConfig.getServices).toHaveBeenCalledWith(1);
    expect(backendService.getConfigurations).toHaveBeenCalledWith(2);
    expect(envVariables.getConnectedServices).toHaveBeenCalledWith(2);
    expect(envVariables.getVariables).toHaveBeenCalledWith(2);
    expect(imageService.getImageRepo).toHaveBeenCalledWith(2);



  });

  it('should return the correct data for a Database service', async () => {
    jest.spyOn(projectRepository,'getLatestProject').mockResolvedValueOnce([{
      'id':projectId,
      'userId':4
    }]);
    projectServiceConfig.getServices.mockResolvedValue([{ id: 2, serviceType: 'Database' }]);
    databaseService.getConfigurations.mockResolvedValue([{ port: 8080, numberOfReplicas: 2, name: 'database' }]);
    envVariables.getConnectedServices.mockResolvedValue([{ field: 'DATABASE_URL' }]);
    envVariables.getVariables.mockResolvedValue([{ field: 'API_KEY', value: '12345' }]);
    imageService.getImageRepo.mockResolvedValue([{ imageRepositoryUrl: 'https://example.com/repo', username: 'user', email: 'user@example.com', imageRepositoryToken: 'token' }]);

    const result = await services.getLatestProject(1);

    // Assert that the result is correct
    expect(result).toEqual([{ service_type: 'Database', configurations: { port: 8080, numberOfReplicas: 2, name: 'database' }, connectedServices: ['DATABASE_URL'], customEnv: { API_KEY: '12345' }, imageRepository: { repositoryImageAddress: 'https://example.com/repo', username: 'user', email: 'user@example.com', token: 'token' } }]);


    // Assert that the mock functions were called with the correct arguments
    expect(projectRepository.getLatestProject).toHaveBeenCalledWith(1);
    expect(projectServiceConfig.getServices).toHaveBeenCalledWith(1);
    expect(databaseService.getConfigurations).toHaveBeenCalledWith(2);
    expect(envVariables.getConnectedServices).toHaveBeenCalledWith(2);
    expect(envVariables.getVariables).toHaveBeenCalledWith(2);
    expect(imageService.getImageRepo).toHaveBeenCalledWith(2);
  });


});