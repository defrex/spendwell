/*eslint no-var: 0*/

process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'live-reloading';

const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const config = require('./dev.config');


config.entry.app = [
  config.entry.app,
  'webpack-dev-server/client?https://dev.spendwell.co/',
  'webpack/hot/dev-server',
];

config.entry.calculators = [
  config.entry.calculators,
  'webpack-dev-server/client?https://dev.spendwell.co/',
  'webpack/hot/dev-server',
];

config.entry.blog = [
  config.entry.blog,
  'webpack-dev-server/client?https://dev.spendwell.co/',
  'webpack/hot/dev-server',
];

config.entry.pages = [
  config.entry.pages,
  'webpack-dev-server/client?https://dev.spendwell.co/',
  'webpack/hot/dev-server',
];


config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
]);

var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
  hot: true,
  colors: true,
  noInfo: true,
  port: 3000,
  publicPath: config.output.publicPath,
  proxy: {
    '*': {
      target: 'http://localhost:8000',
      secure: false,
    },
  },
});

server.listen(3000, ()=> console.log('localhost:3000'));
