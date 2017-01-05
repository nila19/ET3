/** ** ./dashboard/chart/chart.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.chart').component('chart', {
		templateUrl: 'dashboard/chart/chart.htm',
		controller: ChartController
	});

	ChartController.$inject = ['chartService', 'CONSTANTS', '$location'];
	function ChartController(cs, CONSTANTS, $location) {
		var vm = this;

		// /////////////////////
	}
})(window.angular);
