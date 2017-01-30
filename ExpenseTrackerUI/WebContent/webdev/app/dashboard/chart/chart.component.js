/** ** ./dashboard/chart/chart.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.chart').component('chart', {
		templateUrl: 'dashboard/chart/chart.htm',
		controller: ChartController
	});

	ChartController.$inject = ['chartService', '$timeout'];
	function ChartController(cs, $timeout) {
		var vm = this;
		init();

		// ***** Function declarations *****//
		function init() {
			vm.data = cs.data;

			// Wait to make sure DOM is loaded with the tagId, before the chart is rendered..
			$timeout(renderChart, 1000);
		}

		function renderChart() {
			cs.renderChart();
		}
	}
})(window.angular);
