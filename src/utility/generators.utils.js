const { MODELS, MICROSERVICES } = require('../constants/generator.constants');


const bfs = (v, adjList, visited) => {
  let q = [];
  let currentGroup = [];
  let i, len, adjV, nextVertex;
  q.push(v);
  visited[v] = true;
  while (q.length > 0) {
    v = q.shift();
    currentGroup.push(v);
    adjV = adjList[v];
    for (i = 0, len = adjV.length; i < len; i += 1) {
      nextVertex = adjV[i];
      if (!visited[nextVertex]) {
        q.push(nextVertex);
        visited[nextVertex] = true;
      }
    }
  }
  return currentGroup;
};

const getConfigurations = (services, isOffline) => {
  const config = {
    FrontEnd: [],
    BackEnd: [],
    Database: [],
    Networks: [],
  };
  const adjList = {};
  services.forEach((service) => {
    adjList[service['configurations']['name']] = service['connected_service'];
  });
  let networks = [];
  let visited = {};
  for (let v in adjList) {
    if (!visited[v]) {
      const network = bfs(v, adjList, visited).sort();
      networks.push({
        name: network.join('_'),
        services: network,
      });
    }
  }
  console.log('networks',networks);
  services.forEach((service) => {
    const envVariables = Object.keys(service['customEnv']).map((key) => ({
      name: key,
      value: service['customEnv'][key],
    }));
    const serviceConfig = {
      ...service['configurations'],
      envVariables,
      image: service['imageRepository'] ? service['imageRepository']['username'] + '/' + service['configurations']['name'] : service['configurations']['name'],
      ...service['imageRepository'],
      imagePullPolicy: isOffline ? 'Never' : 'Always',
      networks: networks.find((network) => network['services'].includes(service['configurations']['name'])).name
    };
    
    
    

    if(service['service_type'] === 'FrontEnd'){
      serviceConfig['backends'] = [];
      service['connected_service'].forEach((serviceName) => {
        const connectedService = services.find((service) =>service['configurations']['name'] === serviceName);
        if(!connectedService || connectedService['service_type'] !== 'BackEnd'){
          throw new Error('Invalid service connection');
        }
        serviceConfig['backends'].push({
          name: connectedService['configurations']['name'],
          port: connectedService['configurations']['port'],
        });
      });
    }
    else if(service['service_type'] === 'BackEnd'){
      serviceConfig['databases'] = [];
      serviceConfig['frontends'] = [];
      service['connected_service'].forEach((serviceName, index) => {
        const connectedService = services.find((service) => service['configurations']['name'] === serviceName);
        if(!connectedService || (connectedService['service_type'] !== 'Database' && connectedService['service_type'] !== 'FrontEnd')){
          throw new Error('Invalid service connection');
        }
        if(connectedService['service_type'] === 'Database'){
          serviceConfig['databases'].push({
            ...connectedService['configurations'],
            dbHost: connectedService['configurations']['name'],
            model: MODELS[index]
          });
        }
        else{
          serviceConfig['frontends'].push({
            name: connectedService['configurations']['name'],
            port: connectedService['configurations']['port'],
          });
        }

      });
        
    }
    config[service['service_type']].push(serviceConfig);
  });
  config['Networks'] = networks.map((network) => ({name: network.name}));
  console.log('networks: ', networks);
  return config;
};

const getBoilerplatesConfig = (config) => {
  let boilerplates = [];

  MICROSERVICES.forEach((microservice) => {
    if (config[microservice]) {
      config[microservice].forEach((instance) => {
        boilerplates.push({
          name: instance.name,
          imageName: instance.image,
          username: instance.username,
          password: instance.token,
          email: instance.email,
          serverAddress: instance.repositoryImageAddress,
        });
      });
    }
  });
  return boilerplates;
};

module.exports = { getConfigurations, getBoilerplatesConfig };