const services = require('../../src/services/project.service.js');
const projectRepository = require('../../src/repositories/project.repositories');
const { generateBoilerplate } = require('../../src/services/generators/generateBoilerplate.service.js');
const dockerComposeGenerator = require('../../src/services/generators/docker-compose.js');
const generateDockerImage = require('../../src/services/generators/docker-image.js');
const pushDockerImage = require('../../src/services/pushDockerImage.js');
const k8sManifestGenerator = require('../../src/services/generators/k8s-manifest.js');
const { zipFolder } = require('../../src/services/zipping.service.js');
const { OUTPUT_PATH } = require('../../src/constants/app.constants.js');
const path = require('path');


const sampleConfigurations = {
  auth: {
    username: 'username',
    email: 'email',
    password: 'password',
    serverAddress: 'serverAddress',
  },
  frontend: {
    name: 'frontend',
  }
};
const projectId = 1;

jest.mock('../../src/utility/generators.utils.js', () => {
  return {
    getConfigurations: jest.fn().mockReturnValue(sampleConfigurations),
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
  return jest.fn();
});
jest.mock('../../src/services/pushDockerImage.js', () => {
  return jest.fn();
});
jest.mock('../../src/services/generators/k8s-manifest.js', () => {
  return jest.fn();
});
jest.mock('../../src/services/zipping.service.js', () => {
  return {
    zipFolder: jest.fn(),
  };
});
const repositoryServiceObj = require('../../src/utility/projects.utils.js');

describe('microservices service testing', () => {
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
    // eslint-disable-next-line no-unused-vars
    const mockres = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const result = await services.generateProject(mockreq.body);
    expect(result).toEqual({'services':[
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
    ]});
  });
  it('should call the generators with correct parameters', async () => {
    const folderPath = path.join(OUTPUT_PATH, projectId.toString());
    const zipPath = path.join(OUTPUT_PATH, `${projectId}.zip`);

    expect(generateBoilerplate).toHaveBeenCalledWith(projectId, 'FrontEnd', sampleConfigurations);
    expect(dockerComposeGenerator).toHaveBeenCalledWith(projectId, sampleConfigurations);
    expect(generateDockerImage).toHaveBeenCalledWith(projectId, 'username');
    expect(pushDockerImage).toHaveBeenCalledWith(projectId, 'username', 'password', 'email', 'serverAddress');
    expect(k8sManifestGenerator).toHaveBeenCalledWith(projectId);
    expect(zipFolder).toHaveBeenCalledWith(folderPath, zipPath);
  });
});


