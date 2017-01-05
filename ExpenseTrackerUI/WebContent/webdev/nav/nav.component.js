/** ** ./nav/nav.component.js *** */

(function(angular) {
	'use strict';

	angular.module('nav').component('nav', {
		templateUrl: 'nav/nav.htm',
		controller: NavController
	});

	NavController.$inject = ['navService', 'CONSTANTS', '$location'];
	function NavController(ns, CONSTANTS, $location) {
		var vm = this;

		// /////////////////////
	}
})(window.angular);
