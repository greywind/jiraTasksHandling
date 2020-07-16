const globalWebpack = require("../webpack.config.js")();

module.exports = ({ config }) => {
    config.module.rules = globalWebpack.module.rules;
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.alias = { ...config.resolve.alias, ...globalWebpack.resolve.alias };
    config.plugins.push(...globalWebpack.plugins);
    return config;
};