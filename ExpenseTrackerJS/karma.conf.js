/* eslint no-magic-numbers: "off" */

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'https://cdnjs.cloudflare.com/ajax/libs/mocha/3.4.2/mocha.js',
      'https://cdnjs.cloudflare.com/ajax/libs/chai/4.0.2/chai.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/sinon.js/1.15.4/sinon.min.js',
      'public/bower_components/socket.io/socket.io.min.js',
      'public/bower_components/jquery/dist/jquery.min.js',
      'public/bower_components/lodash/dist/lodash.min.js',
      'public/bower_components/moment/min/moment.min.js',
      'public/bower_components/bootstrap/dist/js/bootstrap.min.js',
      'public/bower_components/chart.js/dist/Chart.min.js',
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-resource/angular-resource.js',
      'public/bower_components/angular-route/angular-route.min.js',
      'public/bower_components/angular-animate/angular-animate.min.js',
      'public/bower_components/angular-chart.js/dist/angular-chart.min.js',
      'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'public/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'public/dist/app.all.module.js',
      'public/dist/app.all.js',
      'public/dist/test.all.js'
    ],
    exclude: [],

    // possible values: 'dots', 'progress'
    reporters: ['progress'],

    hostname: 'localhost',
    port: 9876,
    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,
    autoWatch: true,
    autoWatchBatchDelay: 2000,

    // start these browsers, currently available:
    // browsers: ['Chrome'],
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],
    // browsers: ['PhantomJS'],
    // browsers: ['Firefox'],
    concurrency: 3,

    // browserNoActivityTimeout: 60000,
    // browserDisconnectTimeout: 30000,
    // browserDisconnectTolerance: 5,
    // retryLimit: 5,
    // if browser does not capture in given timeout [ms], kill it
    // captureTimeout: 60000,
    captureTimeout: 10000,
    // auto run tests on start (when browsers are captured) and exit
    singleRun: false,
    // report which specs are slower than 500ms
    reportSlowerThan: 500,

    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-firefox-launcher',
    ],
    forceJSONP: true,
    jsVersion: 0,
  });
};
