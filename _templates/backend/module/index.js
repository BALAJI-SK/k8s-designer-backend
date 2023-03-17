module.exports = {
    params: ({ args }) => {
        const parsedConfig = JSON.parse(args.config);
        console.log(parsedConfig);
        return parsedConfig;
    }
};