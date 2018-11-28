/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const path = require('path');
const webpack = require('webpack');

const commonConfig = {
  devtool: 'eval',
  mode: 'production',
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'halt.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loaders: ['babel-loader']
    }]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  stats: {
    all: false,
    modules: true,
    chunks: false,
    cachedAssets: false,
    colors: true,
    errors: true,
    errorDetails: false,
    warnings: false,
  },
}

module.exports = Object.assign({
    entry: {
      main: './src/electron/electron.prod.js'
    }
  },
  commonConfig
);
