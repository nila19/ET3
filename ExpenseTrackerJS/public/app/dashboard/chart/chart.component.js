/** ** ./dashboard/chart/chart.component.js *** */

import './chart.module';
import './chart.service';

(function (angular) {
  'use strict';

  const ChartController = function (cs) {
    const vm = this;

    const init = function () {
      vm.data = cs.data;
    };

    init();
  };

  angular.module('dashboard.chart').component('chart', {
    templateUrl: 'dashboard/chart/chart.htm',
    controller: ChartController
  });
  ChartController.$inject = ['chartService'];
})(window.angular);
