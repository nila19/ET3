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
		}).when('/search/:drill', {
			template: '<search></search>'
		}).when('/search', {
			template: '<search></search>'
		}).when('/startup', {
			template: '<startup></startup>'
		}).otherwise('/startup');
	}
})(window.angular);
