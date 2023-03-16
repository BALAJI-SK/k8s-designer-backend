const services = require('../../src/services/project.service.js');
const projectRepository = require('../../src/repositories/project.repositories');
const repositoryServiceObj = require('../../src/utility/projects.utils.js');

describe('microservices  service  testing', () => {
  it('should populate microservice table ', async () => {

  
    jest.spyOn(projectRepository,'create').mockResolvedValueOnce({
      'id':3,
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
});


