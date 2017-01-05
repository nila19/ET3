/** ** ./dashboard/explist/explist.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').component('explist', {
		templateUrl: 'dashboard/explist/explist.htm',
		controller: ExplistController
	});

	ExplistController.$inject = ['explistService', 'CONSTANTS', '$location'];
	function ExplistController(els, CONSTANTS, $location) {
		var vm = this;

		// /////////////////////
	}
})(window.angular);
