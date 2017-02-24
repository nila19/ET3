'use strict';

const plugins = require('gulp-load-plugins')();

// converts all object property values into an array.
const toArray = function (obj) {
  const arr = [];

  for (const key in obj) {
    // check if the property is directly on the object & not inherited from prototype.
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      arr.push(obj[key]);
    }
  }
  return arr;
};

const buildExcludes = function (...args) {
  const excludes = [];
  // add the declared paths from path.excludes to a temp array.
  let paths = toArray(path.excludes);

  // add any additional paths arguments to the array.
  paths = paths.concat(args);

  // negate the path names.
  paths.forEach(function each(path) {
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
    bower: dir.public + '/bower_components/**/*.*'
  },
  public: {
    js: dir.public + '/**/*.js',
    less: dir.public + '/**/*.less',
    htm: dir.public + '/**/*.htm',
    images: dir.public + '/images/**/*.*'
  },
  server: {
    js: {
      api: dir.root + '/api/**/*.js',
      bin: dir.root + '/bin/**/*.js',
      routes: dir.root + '/routes/**/*.js',
      utils: dir.root + '/utils/**/*.js'
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
  // gulp --merge
  maps: Boolean(plugins.util.env.maps)
};

const src = {
  public: {
    js: [path.public.js].concat(buildExcludes()),
    less: [path.public.less].concat(buildExcludes())
  },
  server: {
    js: toArray(path.server.js).concat(buildExcludes()),
    ejs: [path.server.ejs].concat(buildExcludes())
  }
};

module.exports = {
  flag: flag,
  src: src,
  log: log
};
