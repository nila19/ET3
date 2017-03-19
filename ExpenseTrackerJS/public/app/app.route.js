/** ** ./app.route.js *** */

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
