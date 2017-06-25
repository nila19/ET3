'use strict';

const _ = require('lodash');
const plugins = require('gulp-load-plugins')();

const buildExcludes = function (...args) {
  const excludes = [];
  // add the declared paths from path.excludes to a temp array.
  // add any additional paths arguments to the array.
  const paths = _.values(path.excludes).concat(args);

  // negate the path names.
  paths.forEach(function (path) {
    excludes.push('!' + path);
  });
  return excludes;
};

const log = function (msg, task) {
  plugins.util.log('********** ' + msg + ' :: ' + (task || '') + ' **********');
};

//* ***************************** 'Intermediate' path variables ******************************//
const dir = {
  root: './',
  public: './public'
};

const path = {
  excludes: {
    nodeModules: dir.root + '/node_modules/**/*.*',
    bower: dir.public + '/bower_components/**/*.*',
    theme: dir.public + '/theme/**/*.*'
  },
  public: {
    js: dir.public + '/app/**/*.js',
    jsTest: dir.public + '/test/**/*.spec.js',
    less: dir.public + '/css/**/*.less',
    htm: dir.public + '/app/**/*.htm',
    images: dir.public + '/images/**/*.*',
    minify: {
      modules: dir.public + '/app/**/*.module.js',
      rest: dir.public + '/app/**/*.js',
      test: dir.public + '/test/**/*.spec.js',
    }
  },
  server: {
    js: {
      api: dir.root + '/api/**/*.js',
      test: dir.root + '/test/**/*.spec.js'
    },
    ejs: dir.root + '/views/**/*.ejs'
  }
};

//* ********************** 'Source' & 'Destination' paths used in Tasks ***********************//
const flag = {
  // gulp --prod
  prod: Boolean(plugins.util.env.prod),
  // gulp --merge
  merge: Boolean(plugins.util.env.merge),
  // gulp --minify
  minify: Boolean(plugins.util.env.minify),
  // gulp --maps
  maps: Boolean(plugins.util.env.maps)
};

const src = {
  public: {
    js: [path.public.js].concat(buildExcludes()),
    jsTest: [path.public.jsTest].concat(buildExcludes()),
    less: [path.public.less].concat(buildExcludes()),
    minify: {
      modules: [path.public.minify.modules].concat(buildExcludes()),
      rest: [path.public.minify.rest].concat(buildExcludes(path.public.minify.modules)),
      test: [path.public.minify.test].concat(buildExcludes())
    }
  },
  server: {
    js: _.values(path.server.js).concat(buildExcludes()),
    ejs: [path.server.ejs].concat(buildExcludes())
  }
};

const dest = {
  folder: dir.public + '/dist',
  file: {
    modules: 'app.all.module.js',
    rest: 'app.all.js',
    test: 'test.all.js'
  }
};

module.exports = {
  flag: flag,
  src: src,
  dest: dest,
  log: log
};
