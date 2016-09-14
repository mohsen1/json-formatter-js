'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'sourcemap',
  entry: {
    app: ['./src/index.ts']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist',
    filename: 'json-formatter.js',
    library: 'JSONFormatter',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: 'style?sourceMap!css?sourceMap!less?sourceMap'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  }
};
