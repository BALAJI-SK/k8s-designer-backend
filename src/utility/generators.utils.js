

const getConfigurations = (data) => {
  console.log(data);
  const sampleConfig = {
    auth: {
      username: 'vk2000',
      email: 'var***@gmail.com',
      serverAddress: 'https://registry.hub.docker.com/v2/',
      password: 'dckr_p****',
    },
    frontend: [{
      name: 'testfrontend',
      containerPort: 4005,
      hostPort: 4005,
      image: 'vk2000/testfrontend',
      envVariables: [
        {
          name: 'key1',
          value: 'value1',
        },
        {
          name: 'key2',
          value: 'value2',
        },
        {
          name: 'key3',
          value: 'value3',
        }
      ],
      backends : [{
        name: 'testbackend',
        url: 'http://testbackend',
        port: 5500,
      }]
    }],
    database: [
      {
        dbName: 'testdb',
        image: 'vk2000/testdb',
        dbVersion: 'latest',
        dbContainerPort: 5432,
        dbHostPort: 5433,
        dbUser: 'postgres',
        dbPassword: 'postgres',
        dbSchema: 'public',
      },
      {
        dbName: 'testdb2',
        image: 'vk2000/testdb2',
        dbVersion: 'latest',
        dbContainerPort: 5432,
        dbHostPort: 5434,
        dbUser: 'postgres',
        dbPassword: 'postgres',
        dbSchema: 'public',
      }
    ],
    backend: [{
      name: 'testbackend',
      image: 'vk2000/testbackend',
      containerPort: 5500,
      hostPort: 5500,
      envVariables: [
        {
          name: 'key1',
          value: 'value1',
        },
        {
          name: 'key2',
          value: 'value2',
        },
      ],
      frontends : [{
        name: 'testfrontend',
        url: 'http://testfrontend',
        port: 4005,
      }],
      databases : [{
        dbName: 'testdb',
        dbHost: 'testdb',
        dbPort: 5432,
        dbUser: 'postgres',
        dbPassword: 'postgres',
        model: {
          name: 'Color',
          tableName: 'Colors',
          data: ['red', 'green', 'blue']
        }
      },
      {
        dbName: 'testdb2',
        dbHost: 'testdb2',
        dbPort: 5432,
        dbUser: 'postgres',
        dbPassword: 'postgres',
        model: {
          name: 'Country',
          tableName: 'Countries',
          data: ['India', 'USA', 'UK']
        }
      }
      ]
    }]
  };
  
  return sampleConfig;
};

module.exports = { getConfigurations };