/** ** ./dashboard/dashboard.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard').component('dashboard', {
		templateUrl: 'dashboard/dashboard.htm',
		controller: DashboardController
	});

	DashboardController.$inject = ['dashboardService', 'CONSTANTS', '$location'];
	function DashboardController(ds, CONSTANTS, $location) {
		var vm = this;

		// /////////////////////
	}
})(window.angular);
