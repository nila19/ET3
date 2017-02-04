/** ** ./dashboard/chart/chart.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.chart').component('chart', {
		templateUrl: 'dashboard/chart/chart.htm',
		controller: ChartController
	});

	ChartController.$inject = ['chartService'];
	function ChartController(cs) {
		var vm = this;
		init();

		vm.hasPrevPage = hasPrevPage;
		vm.hasNextPage = hasNextPage;
		vm.prevPage = prevPage;
		vm.nextPage = nextPage;

		// ***** Function declarations *****//
		function init() {
			vm.data = cs.data;
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
