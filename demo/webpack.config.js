'use strict';

const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'demo.js'),
  output: {
    path: __dirname,
    filename: 'demo.bundle.js'
  }
}