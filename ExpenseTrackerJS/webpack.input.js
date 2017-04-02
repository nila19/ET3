/* eslint no-unused-vars: 'off'*/

// import './public/bower_components/bootstrap/dist/css/bootstrap.css';
// import './public/theme/css/font-awesome.min.css';

// import './public/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
// import './public/bower_components/animate.css/animate.css';
// import './public/theme/css/material-dashboard.css';
// import './public/theme/css/fonts.css';

// const ngBoot = require('./public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min');

// additional changes..

import jQuery from 'jquery';
import _ from 'lodash';
import angular from 'angular';

window.$ = jQuery;
window._ = _;
window.angular = angular;

require('chart.js');
require('bootstrap');
require('less');
require('moment');

require('angular-resource');
require('angular-route');
require('angular-animate');
require('angular-chart');
require('angular-bootstrap');
require('bootstrap-datepicker');

require('./public/theme/js/material.min');
require('./public/theme/js/material-dashboard');
require('./public/theme/js/bootstrap-notify');
