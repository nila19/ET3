/* eslint no-sync: "off" */

'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const streamqueue = require('streamqueue');
const gulpif = require('gulp-if');
const plugins = require('gulp-load-plugins')();
const del = require('del');
const fs = require('fs');

const gp = require('./gulp-paths');
const src = gp.src;

//* ******************************* tasks ********************************//
gulp.task('default', function () {
  gp.log('Usage : gulp [all | watch] --merge --minify');
});

gulp.task('all', function (next) {
  return runSequence('server', 'public', function () {
    gp.log('default', 'END');
    gp.log('COMPLETED ALL DEFAULT TASKS');
    next();
  });
});

gulp.task('watch', ['all'], function () {
  gulp.watch(src.public.js, ['public-js']);
  gulp.watch(src.public.less, ['public-less']);
  gulp.watch(src.server.js, ['server-js']);
  gulp.watch(src.server.ejs, ['server.ejs']);
  gp.log('WATCHING FOR SOURCE CHANGES');
});

gulp.task('server', function (next) {
  return runSequence('server-js', function () {
    gp.log('SERVER processing', 'COMPLETED');
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

gulp.task('public', ['public-js', 'public-less'], function () {
  gp.log('PUBLIC processing', 'COMPLETED');
});

gulp.task('public-js', function (next) {
  return runSequence('public-js-eslint', 'public-js-merge-modules', 'public-js-merge-rest', function () {
    gp.log('PUBLIC js processing', 'COMPLETED');
    next();
  });
});

gulp.task('public-js-eslint', ['public-js-clean'], function () {
  const pipe = gulp.src(src.public.js).pipe(plugins.eslint()).pipe(plugins.eslint.format());

  return pipe.pipe(plugins.eslint.failAfterError());
});

gulp.task('public-js-clean', function () {
  if(fs.existsSync(gp.dest.folder + '/' + gp.dest.file.modules)) {
    del.sync(gp.dest.folder + '/' + gp.dest.file.modules);
  }
  if(fs.existsSync(gp.dest.folder + '/' + gp.dest.file.rest)) {
    del.sync(gp.dest.folder + '/' + gp.dest.file.rest);
  }
});

gulp.task('public-js-merge-modules', function () {
  return streamqueue({objectMode: true}, gulp.src(src.public.minify.modules))
		.pipe(gulpif(gp.flag.merge, plugins.concat(gp.dest.file.modules)))
		.pipe(gulpif(gp.flag.minify, plugins.uglify()))
		.pipe(gulp.dest(gp.dest.folder));
});

gulp.task('public-js-merge-rest', function () {
  return streamqueue({objectMode: true}, gulp.src(src.public.minify.rest))
		.pipe(gulpif(gp.flag.merge, plugins.concat(gp.dest.file.rest)))
		.pipe(gulpif(gp.flag.minify, plugins.uglify()))
		.pipe(gulp.dest(gp.dest.folder));
});

gulp.task('public-less', function () {
  return gulp.src(src.public.less).pipe(plugins.less()).pipe(gulpif(gp.flag.prod, plugins.cleanCss()));
});
