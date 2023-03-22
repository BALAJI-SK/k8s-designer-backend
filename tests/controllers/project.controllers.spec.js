// const services = require('../src/services/microservices.config.service');
const ProjectService = require('../../src/services/project.service');
const controller = require('../../src/controllers/project.controller');
const jwt = require('jsonwebtoken');
const { describe } = require('node:test');

// jest.mock('../../src/services/microservices.config.service');

describe('microservices controller testing', () => {
  it('should populate microservice table ', async () => {
   
    jest.spyOn(ProjectService, 'generateProject').mockResolvedValue('path/to/zip/file');
    jest.spyOn(jwt, 'verify').mockResolvedValue({id: '1234'});
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
    ]},
    headers:{
      'authorization': 'Bearer token'
    }};
    const mockres = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      download: jest.fn(),
      set: jest.fn()
    };
    await controller.generateProjectController(mockreq, mockres);
    expect(mockres.status).toHaveBeenCalledWith(200);
    expect(mockres.download).toHaveBeenCalledWith('path/to/zip/file');
  });

  it('should return error when service throw error ', async () => {
   
    jest.spyOn(ProjectService, 'generateProject').mockRejectedValue(new Error('error'));    
    jest.spyOn(jwt, 'verify').mockResolvedValue({id: '1234'});
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
    ]},
    headers:{
      'authorization': 'Bearer token'
    }
    };
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

describe('microservices controller testing', () => {
  it('should get latest project ', async () => {
   
    jest.spyOn(ProjectService, 'getLatestProject').mockResolvedValue('path/to/zip/file');
    jest.spyOn(jwt, 'verify').mockResolvedValue({id: '1234'});
    const mockreq = {
      headers:{
        'authorization': 'Bearer token'
      }};
    const mockres = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      download: jest.fn(),
    };
    await controller.getLatestProjectController(mockreq, mockres);
    expect(mockres.status).toHaveBeenCalledWith(200);
    expect(mockres.json).toHaveBeenCalledWith('path/to/zip/file');
  });

  it('should return error when service throw error ', async () => {
   
    jest.spyOn(ProjectService, 'getLatestProject').mockRejectedValue(new Error('error'));    
    jest.spyOn(jwt, 'verify').mockResolvedValue({id: '1234'});
    const mockreq = {
      headers:{
        'authorization': 'Bearer token'
      }};
    const mockres = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.getLatestProjectController(mockreq, mockres);
    expect(mockres.status).toHaveBeenCalledWith(500);
    expect(mockres.json).toHaveBeenCalledWith({
      data:'error'
    });
  });
});

