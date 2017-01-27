
process.env.BABEL_ENV = 'live-reloading'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const config = require('./dev.config')

config.entry.app = [
  config.entry.app,
  'webpack-dev-server/client?https://dev.spendwell.co/',
  'webpack/hot/dev-server',
]

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
])

const compiler = webpack(config)
const server = new WebpackDevServer(compiler, {
  hot: true,
  colors: true,
  noInfo: true,
  port: 3000,
  publicPath: config.output.publicPath,
  proxy: {
    '*': {
      target: 'http://app:8000',
      secure: false,
    },
  },
})

server.listen(3000, () => console.log('Webpack Dev Server started on port 3000'))
