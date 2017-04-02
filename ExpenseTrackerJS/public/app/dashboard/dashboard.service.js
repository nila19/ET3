/** ** ./dashboard/dashboard.service.js *** */

import './dashboard.module';

(function (angular) {
  'use strict';

  const dashboardService = function () {
    const data = {
      loading: {
        on: false,
        donestep: 0
      }
    };

    return {
      data: data,
    };
  };

  angular.module('dashboard').factory('dashboardService', dashboardService);
  dashboardService.$inject = [];
})(window.angular);
