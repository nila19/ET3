/* eslint no-unused-vars: 'off'*/

// import './public/bower_components/bootstrap/dist/css/bootstrap.css';
import './public/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
import './public/bower_components/animate.css/animate.css';
import './public/theme/css/material-dashboard.css';
// import './public/theme/css/font-awesome.min.css';
import './public/theme/css/fonts.css';

const jQuery = require('./public/bower_components/jquery/dist/jquery');
const _ = require('./public/bower_components/lodash/dist/lodash');

window.jQuery = jQuery;
window._ = _;

const Chart = require('./public/bower_components/chart.js/dist/Chart');
const boot = require('./public/bower_components/bootstrap/dist/js/bootstrap.min');
const less = require('./public/bower_components/less/dist/less.min');
const moment = require('./public/bower_components/moment/min/moment.min');

const angular = require('./public/bower_components/angular/angular');

window.angular = angular;

const ngAnimate = require('./public/bower_components/angular-animate/angular-animate');
const ngRoute = require('./public/bower_components/angular-route/angular-route');
const ngResource = require('./public/bower_components/angular-resource/angular-resource');
const ngChart = require('./public/bower_components/angular-chart.js/dist/angular-chart');
const ngBoot = require('./public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min');
const datePicker = require('./public/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min');

const mat = require('./public/theme/js/material.min');
const matdb = require('./public/theme/js/material-dashboard');
const notify = require('./public/theme/js/bootstrap-notify');
