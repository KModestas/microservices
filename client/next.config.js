module.exports = {
  // poll files every 300ms (sometimes next.js doesn't automatically detect file changes when in a docker container)
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
