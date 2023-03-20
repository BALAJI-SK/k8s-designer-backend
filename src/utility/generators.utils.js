const { MODELS } = require('../constants/generator.constants');


const getConfigurations = (services) => {
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
      ...service['imageRepository'],
    };
    if(service['service_type'] === 'FrontEnd'){
      serviceConfig['backends'] = service['connected_service'].map((backendName) => {
        const connectedBackend = services.find((service) => service['service_type'] === 'BackEnd' && service['configurations']['name'] === backendName);
        return {
          name: connectedBackend['configurations']['name'],
          port: connectedBackend['configurations']['port'],
        };
      });
    }
    else if(service['service_type'] === 'BackEnd'){
      service['connected_service'].forEach((serviceName, index) => {
        const connectedService = services.find((service) => service['configurations']['name'] === serviceName);
        if(connectedService['service_type'] === 'Database'){
          serviceConfig['databases'] = {
            ...connectedService['configurations'],
            model: MODELS[index]
          };
        }
        else if(connectedService['service_type'] === 'FrontEnd'){
          serviceConfig['frontends'] = {
            name: connectedService['configurations']['name'],
            port: connectedService['configurations']['port'],
          };
        }
      });
        
    }
    config[service['service_type']].push(serviceConfig);
  });
  return config;
};

module.exports = { getConfigurations };