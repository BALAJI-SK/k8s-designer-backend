

const getConfigurations = (data) => {
  console.log(data);
  const config = {
    auth: {
      username: 'vk2000',
      email: 'v***@gmail.com',
      serverAddress: 'https://registry.hub.docker.com/v2/',
      password: '********',
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
      backends : []
    }],
  };
  return config;
};

module.exports = { getConfigurations };