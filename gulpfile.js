'use strict';

var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");

browserify("./index.js", { debug: true })
  .transform(babelify)
  .bundle()
  .on("error", function (err) { console.log("Error : " + err.message); })
  .pipe(fs.createWriteStream("bundle.js"));