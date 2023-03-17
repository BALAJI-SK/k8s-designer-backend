// const services = require('../src/services/microservices.config.service');
const ProjectService = require('../../src/services/project.service');
const controller = require('../../src/controllers/project.controller');


// jest.mock('../../src/services/microservices.config.service');

describe('microservices controller testing', () => {
  it('should populate microservice table ', async () => {
   
    jest.spyOn(ProjectService, 'generateProject').mockResolvedValue('path/to/zip/file');
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
    const mockres = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      download: jest.fn(),
    };
    await controller.generateProjectController(mockreq, mockres);
    expect(mockres.status).toHaveBeenCalledWith(200);
    expect(mockres.download).toHaveBeenCalledWith('path/to/zip/file');
  });

  it('should return error when service throw error ', async () => {
   
    jest.spyOn(ProjectService, 'generateProject').mockRejectedValue(new Error('error'));    
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
    const mockres = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.generateProjectController(mockreq, mockres);
    expect(mockres.status).toHaveBeenCalledWith(500);
    expect(mockres.json).toHaveBeenCalledWith({
      data:'error'
    });
  });
});