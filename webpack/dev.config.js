/*eslint no-var: 0*/

var config = require('./base.config.js');


config.devtool = 'sourcemap';
// config.devtool = 'cheap-module-eval-source-map';
config.debug = true;

config.module.loaders.push({ test: require.resolve('react'), loader: 'expose?React' });

module.exports = config;