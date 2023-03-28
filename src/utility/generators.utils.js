const { MODELS } = require('../constants/generator.constants');


const getConfigurations = (services, isOffline) => {
  const config = {
    FrontEnd: [],
    BackEnd: [],
    Database: [],
  };
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
  return config;
};

module.exports = { getConfigurations };