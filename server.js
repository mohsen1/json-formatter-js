'use strict';
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');

var config = require("./webpack.config.js");
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
  progress: true,
  quiet: true,
  publicPath: config.output.publicPath
});
server.listen(8080, console.log.bind(null, 'Development server started at http://localhost:8080'));