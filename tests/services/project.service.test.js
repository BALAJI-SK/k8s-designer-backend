const services = require('../../src/services/project.service.js');

const frontendServiceRepository = require('../../src/repositories/frontendService.repositories.js');
const envVariablesRepository = require('../../src/repositories/envVariables.repositories.js');
const projectServiceConfigRepository = require('../../src/repositories/projectServiceConfig.repositories.js');
const projectRepository = require('../../src/repositories/project.repositories');

describe('microservices  service  testing', () => {
  it('should populate microservice table ', async () => {

    jest.spyOn(frontendServiceRepository,'create').mockResolvedValueOnce({
      'id':1,
      'reactVersion': '2.08',
      'numberOfReplicas':5,
      'name':'React Todo App',
      'port':'5432'
    });
    jest.spyOn(envVariablesRepository,'create').mockResolvedValueOnce({
      'id':2,
      'field': 'port',
      'value':'2345',
      'frontendServicesId':1
    });
    jest.spyOn(projectRepository,'create').mockResolvedValueOnce({
      'id':3,
      'userId':4
    });
    jest.spyOn(projectServiceConfigRepository,'create').mockResolvedValueOnce({
      'id':5,
      'serviceType':'FrontEnd',
      'serviceId':1,
      'projectId':3
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
      }
    ]});
  });
});


