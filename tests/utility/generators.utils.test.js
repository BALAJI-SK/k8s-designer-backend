const { getConfigurations, getBoilerplatesConfig } = require('../../src/utility/generators.utils');

describe('getConfigurations', () => {
  it('should return the correct configurations', () => {
    const mockServices = [
      {
        'service_type': 'FrontEnd',
        'configurations': {
          'port': '3002',
          'numberOfReplicas': 1,
          'name': 'frontend1'
        },
        'connected_service': [
          'backend1'
        ],
        'customEnv': {
          'xyz': 'efgh'
        }
      },
      {
        'service_type': 'BackEnd',
        'configurations': {
          'port': '4002',
          'numberOfReplicas': 1,
          'name': 'backend1'
        },
        'connected_service': [
          'frontend1',
          'database1'
        ],
        'customEnv': {
          'aaaa': 'efgh'
        }
      },
      {
        'service_type': 'Database',
        'configurations': {
          'name': 'database1',
          'port': '5433',
          'numberOfReplicas': 1,
          'dbUser': 'testuser',
          'dbPassword': 'password',
          'schemaName': 'mckEmployees'
        },
        'connected_service': [
          'backend1'
        ],
        'customEnv': {
          'sdf': 'gs'
        }
      }
    ];
    const isOffline = true;
    const result = getConfigurations(mockServices, isOffline);
    expect(result).toEqual({
      'FrontEnd': [
        {
          'port': '3002',
          'numberOfReplicas': 1,
          'name': 'frontend1',
          'envVariables': [
            {
              'name': 'xyz',
              'value': 'efgh'
            }
          ],
          'image': 'frontend1',
          'imagePullPolicy': 'Never',
          'backends': [
            {
              'name': 'backend1',
              'port': '4002'
            }
          ]
        }
      ],
      'BackEnd': [
        {
          'port': '4002',
          'numberOfReplicas': 1,
          'name': 'backend1',
          'envVariables': [
            {
              'name': 'aaaa',
              'value': 'efgh'
            }
          ],
          'image': 'backend1',
          'imagePullPolicy': 'Never',
          'databases': [
            {
              'name': 'database1',
              'port': '5433',
              'numberOfReplicas': 1,
              'dbUser': 'testuser',
              'dbPassword': 'password',
              'schemaName': 'mckEmployees',
              'dbHost': 'database1',
              'model': {
                'name': 'Color',
                'tableName': 'Colors',
                'data': [
                  'red',
                  'green',
                  'blue'
                ]
              }
            }
          ],
          'frontends': [
            {
              'name': 'frontend1',
              'port': '3002'
            }
          ]
        }
      ],
      'Database': [
        {
          'name': 'database1',
          'port': '5433',
          'numberOfReplicas': 1,
          'dbUser': 'testuser',
          'dbPassword': 'password',
          'schemaName': 'mckEmployees',
          'envVariables': [
            {
              'name': 'sdf',
              'value': 'gs'
            }
          ],
          'image': 'database1',
          'imagePullPolicy': 'Never'
        }
      ]
    });
  });

  it('should throw invalid service connection error if frontend is not connected the proper service', () => {
    const mockServices = [{
      'service_type': 'FrontEnd',
      'configurations': {
        'port': '3002',
        'numberOfReplicas': 1,
        'name': 'frontend1'
      },
      'connected_service': [
        'backend1'
      ],
      'customEnv': {
        'xyz': 'efgh'
      }
    }];
    const isOffline = true;
    expect(() => getConfigurations(mockServices, isOffline)).toThrowError('Invalid service connection');
  });
  it('should throw invalid service connection error if backend is not connected the proper service', () => {
    const mockServices = [{
      'service_type': 'BackEnd',
      'configurations': {
        'port': '3002',
        'numberOfReplicas': 1,
        'name': 'frontend1'
      },
      'connected_service': [
        'backend1'
      ],
      'customEnv': {
        'xyz': 'efgh'
      }
    }];
    const isOffline = true;
    expect(() => getConfigurations(mockServices, isOffline)).toThrowError('Invalid service connection');
  });

  it('should create configurations with correct imagePullPolicy', () => {
    const mockServices = [
      {
        'service_type': 'FrontEnd',
        'configurations': {
          'port': '3002',
          'numberOfReplicas': 1,
          'name': 'frontend1'
        },
        'connected_service': [],
        'customEnv': {
          'xyz': 'efgh'
        }
      }
    ];
    const isOffline = false;
    const result = getConfigurations(mockServices, isOffline);
    expect(result).toEqual({
      'FrontEnd': [
        {
          'port': '3002',
          'numberOfReplicas': 1,
          'name': 'frontend1',
          'envVariables': [
            {
              'name': 'xyz',
              'value': 'efgh'
            }
          ],
          'image': 'frontend1',
          'imagePullPolicy': 'Always',
          'backends': [],
        }
      ],
      'BackEnd': [],
      'Database': []
    });
  });

  it('should return configurations with correct image name', () => {
    const mockServices = [
      {
        'service_type': 'FrontEnd',
        'configurations': {
          'port': '3002',
          'numberOfReplicas': 1,
          'name': 'frontend1'
        },
        'connected_service': [],
        'customEnv': {
          'xyz': 'efgh'
        },
        'imageRepository':{
          'repositoryImageAddress':'https://registry.hub.docker.com/v2/',
          'token':'dckr_pat_abc',
          'email': 'abc@gmail.com',
          'username': 'abc'
        }
      }
    ];
    const isOffline = false;
    const result = getConfigurations(mockServices, isOffline);
    expect(result).toEqual({
      'FrontEnd': [
        {
          'port': '3002',
          'numberOfReplicas': 1,
          'name': 'frontend1',
          'envVariables': [
            {
              'name': 'xyz',
              'value': 'efgh'
            }
          ],
          'image': 'abc/frontend1',
          'imagePullPolicy': 'Always',
          'backends': [],
          'username': 'abc',
          'token': 'dckr_pat_abc',
          'email': 'abc@gmail.com',
          'repositoryImageAddress': 'https://registry.hub.docker.com/v2/'
        }
      ],
      'BackEnd': [],
      'Database': []
    });


  });
});

describe('getBoilerplatesConfig', () => {
  it('should return the correct boilerplates config', () => {
    const mockConfig = {
      'FrontEnd': [
        {
          'port': '3002',
          'numberOfReplicas': 1,
          'name': 'frontend1',
          'envVariables': [
            {
              'name': 'xyz',
              'value': 'efgh'
            }
          ],
          'image': 'frontend1',
          'imagePullPolicy': 'Never',
          'backends': [],
          'username': 'testuser',
          'token': 'password',
          'email': 'abc@gmail.com',
          'repositoryImageAddress': 'http://docker.io'
        }
      ],
    };
    const result = getBoilerplatesConfig(mockConfig);
    expect(result).toEqual([
      {
        'email': 'abc@gmail.com',
        'imageName': 'frontend1',
        'name': 'frontend1',
        'password': 'password',
        'serverAddress': 'http://docker.io',
        'username': 'testuser'
      }]);
  });
});
