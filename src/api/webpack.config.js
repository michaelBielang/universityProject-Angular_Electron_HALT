/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const path = require('path');
const webpack = require('webpack');

const commonConfig = {
  devtool: 'eval',
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'server.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader',
      options: {
        typeCheck: true,
        sourceMap: true,
        emitErrors: true
      }
    }, {
      test: /\.ts?$/,
      loader: 'ts-loader'
    }]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx', '.json'],
    modules: [
      'node_modules',
    ],
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
      main: './src/api/server.ts'
    }
  },
  commonConfig
);
