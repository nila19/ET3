/** ** ./dashboard/dashboard.service.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard').factory('dashboardService', dashboardService);

  dashboardService.$inject = [];
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
})(window.angular);
