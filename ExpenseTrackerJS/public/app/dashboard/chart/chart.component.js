/** ** ./dashboard/chart/chart.component.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.chart').component('chart', {
    templateUrl: 'dashboard/chart/chart.htm',
    controller: ChartController
  });

  ChartController.$inject = ['chartService'];
  const ChartController = function (cs) {
    const vm = this;

    init();

    vm.hasPrevPage = hasPrevPage;
    vm.hasNextPage = hasNextPage;
    vm.prevPage = prevPage;
    vm.nextPage = nextPage;

		// ***** function declarations *****//
    const init = function () {
      vm.data = cs.data;
    };
    const hasPrevPage = function () {
      return cs.data.currPageNo > 0;
    };
    const hasNextPage = function () {
      return cs.data.currPageNo < cs.data.maxPageNo;
    };
    const prevPage = function () {
      cs.data.currPageNo -= 1;
      cs.loadCurrentPage();
      cs.renderChart();
    };
    const nextPage = function () {
      cs.data.currPageNo += 1;
      cs.loadCurrentPage();
      cs.renderChart();
    };
  };
})(window.angular);
