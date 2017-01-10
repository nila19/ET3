/** ** ./app.route.js *** */

(function(angular) {
	'use strict';

	angular.module('app').config(appRoute);

	appRoute.$inject = ['$locationProvider', '$routeProvider'];
	function appRoute($locationProvider, $routeProvider) {
		$locationProvider.hashPrefix('!');

		$routeProvider.when('/dashboard', {
			template: '<dashboard></dashboard>'
		}).when('/summary', {
			template: '<summary></summary>'
		}).when('/search/:cat/:mth', {
			template: '<search></search>'
		}).when('/search', {
			template: '<search></search>'
		}).otherwise('/dashboard');
	}
})(window.angular);
