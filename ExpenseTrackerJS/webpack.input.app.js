/* eslint no-unused-vars: 'off'*/

import './public/app/core/directives/directives.module';
import './public/app/core/filters/filters.module';
import './public/app/core/services/services.module';
import './public/app/core/core.module';

import './public/app/dashboard/accounts/accounts.module';
import './public/app/dashboard/dashboard.module';

import './public/app/app.module';

// window.jQuery = jQuery;
// window._ = _;
// window.angular = angular;

const mat = require('./public/theme/js/material.min');
const matdb = require('./public/theme/js/material-dashboard');
const notify = require('./public/theme/js/bootstrap-notify');
