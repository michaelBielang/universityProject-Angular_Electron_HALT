/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

const path = require('path')

const commonConfig = {
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'server.js'
  },
  module: {
    rules: [{
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          typeCheck: true,
          emitErrors: true
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'],
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
