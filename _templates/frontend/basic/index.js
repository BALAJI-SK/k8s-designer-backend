module.exports = {
  params: ({ args }) => {
    const parsedConfig = JSON.parse(args.config);
    return parsedConfig;
  }
};