/** ** ./app.route.js *** */

import './app.module';

import './core/core.component';
import './dashboard/dashboard.component';
import './etmenu/etmenu.component';
import './search/search.component';
import './startup/startup.component';
import './summary/summary.component';

(function (angular) {
  'use strict';
  const appRoute = function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/dashboard', {
      template: '<dashboard></dashboard>'
    }).when('/summary', {
      template: '<summary></summary>'
    }).when('/search/:drill', {
      template: '<search></search>'
    }).when('/search', {
      template: '<search></search>'
    }).when('/startup', {
      template: '<startup></startup>'
    }).otherwise('/startup');
  };

  angular.module('app').config(appRoute);
  appRoute.$inject = ['$locationProvider', '$routeProvider'];
})(window.angular);
