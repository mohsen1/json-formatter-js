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
        loader: "style-loader!css-loader!less-loader"
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: true,
      compress: {
        dead_code: true
      },
      sourceMap: true,
      mangle: false
    })
  ]
};
