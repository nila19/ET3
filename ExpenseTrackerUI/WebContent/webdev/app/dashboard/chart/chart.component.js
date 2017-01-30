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

		vm.hasPrevPage = hasPrevPage;
		vm.hasNextPage = hasNextPage;
		vm.prevPage = prevPage;
		vm.nextPage = nextPage;

		// ***** Function declarations *****//
		function init() {
			vm.data = cs.data;

			// Wait to make sure DOM is loaded with the tagId, before the chart is rendered..
			$timeout(renderChart, 1000);
		}

		function renderChart() {
			cs.renderChart();
		}

		function hasPrevPage() {
			return cs.data.currPageNo > 0;
		}

		function hasNextPage() {
			return cs.data.currPageNo < cs.data.maxPageNo;
		}

		function prevPage() {
			cs.data.currPageNo -= 1;
			cs.loadCurrentPage();
			cs.renderChart();
		}

		function nextPage() {
			cs.data.currPageNo += 1;
			cs.loadCurrentPage();
			cs.renderChart();
		}
	}
})(window.angular);
