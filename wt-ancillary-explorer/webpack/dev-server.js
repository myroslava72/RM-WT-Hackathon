const { join } = require('path');

const devServer = {
  quiet: false,
  port: 3003,
  contentBase: join(__dirname, '..', 'public'),
  hot: true,
  historyApiFallback: true,
  inline: true,
  noInfo: false,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
  },
};

module.exports = devServer;
