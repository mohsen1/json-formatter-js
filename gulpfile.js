'use strict';

/* jshint node: true */

var fs          = require('fs');
var KarmaServer = require('karma').Server;
var browserify  = require('browserify');
var babelify    = require('babelify');
var minifyCSS   = require('gulp-minify-css');
var less        = require('gulp-less');
var gulp        = require('gulp');
var header      = require('gulp-header');
var rename      = require('gulp-rename');
var jshint      = require('gulp-jshint');
var connect     = require('gulp-connect');

var config = {
  pkg : require('./package.json'),
  banner:
    '/*!\n' +
    ' * <%= pkg.name %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
    ' * License: <%= pkg.license %>\n' +
    ' */\n\n\n'
};

gulp.task('jshint', function() {
  return gulp.src(['src/**.js']).pipe(jshint());
});

gulp.task('scripts', ['jshint'], function() {
  return browserify('src/index.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on('error', logError)
    .pipe(connect.reload())
    .pipe(fs.createWriteStream('dist/bundle.js'));
});

gulp.task('styles', function() {

  return gulp.src('src/style.less')
    .pipe(less())
    .on('error', logError)
    .pipe(header(config.banner, {
      timestamp: (new Date()).toISOString(), pkg: config.pkg
    }))
    .pipe(gulp.dest('dist'))
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['src/style.less'], ['styles']);
  gulp.watch(['src/*.js'], ['scripts']);
});

gulp.task('connect', function() {
  connect.server({
    root: '.',
    open: 'demo',
    livereload: true
  });
});

gulp.task('test', function(done) {
  var argv = require('minimist')(process.argv.slice(2));

  new KarmaServer({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: argv.singleRun
  }, done).start();
});

gulp.task('serve', ['watch', 'connect']);
gulp.task('default', ['styles', 'scripts']);

function logError(err) {
  console.log('Error :\n' + err.message);
}