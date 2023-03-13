module.exports = {
    params: ({ args }) => {
        const parsedConfig = JSON.parse(args.config);
        console.log('parsedConfig', parsedConfig.database);
        return parsedConfig.database;
    }    
};