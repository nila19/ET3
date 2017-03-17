'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const gulpif = require('gulp-if');
const plugins = require('gulp-load-plugins')();

const gf = require('./api/bin/gulpfunctions');
const src = gf.src;

//* ******************************* tasks ********************************//
gulp.task('default', function (next) {
  return runSequence('server', 'public', function () {
    gf.log('default', 'END');
    gf.log('COMPLETED ALL DEFAULT TASKS');
    next();
  });
});

gulp.task('watch', ['default'], function () {
  gulp.watch(src.public.js, ['public-js']);
  gulp.watch(src.public.less, ['public-less']);
  gulp.watch(src.server.js, ['server-js']);
  gulp.watch(src.server.ejs, ['server.ejs']);
  gf.log('WATCHING FOR SOURCE CHANGES');
});

gulp.task('server', function (next) {
  return runSequence('server-js', function () {
    gf.log('SERVER processing', 'COMPLETED');
    next();
  });
});

gulp.task('server-js', function () {
  const pipe = gulp.src(src.server.js).pipe(plugins.eslint()).pipe(plugins.eslint.format());

  return pipe.pipe(plugins.eslint.failAfterError());
});

// unused
gulp.task('server-ejs', function () {
  return gulp.src(src.server.ejs).pipe(plugins.ejs());
});

gulp.task('public', function (next) {
  return runSequence('public-js', 'public-less', function () {
    gf.log('PUBLIC processing', 'COMPLETED');
    next();
  });
});

gulp.task('public-js', function () {
  const pipe = gulp.src(src.public.js).pipe(plugins.eslint()).pipe(plugins.eslint.format());

  return pipe.pipe(plugins.eslint.failAfterError());
});

gulp.task('public-less', function () {
  return gulp.src(src.public.less).pipe(plugins.less()).pipe(gulpif(gf.flag.prod, plugins.cleanCss()));
});
