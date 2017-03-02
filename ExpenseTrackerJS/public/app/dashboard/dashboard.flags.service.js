/** ** ./dashboard/dashboard.service.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard').factory('dashboardFlagsService', dashboardFlagsService);

  dashboardFlagsService.$inject = ['etmenuService', 'accountsService', 'addService',
    'chartService', 'explistService', 'billsService'];
  const dashboardFlagsService = function (ms, acs, as, cs, els, bs) {
    const setFlags = function () {
      acs.data.showAcctsRowOne = true;
      as.data.showAdd = true;
      bs.data.showBills = true;

      ms.data.showingMoreAccounts = false;
      acs.data.showAcctsMore = false;
      ms.data.showingChart = false;
      cs.data.showChart = false;
    };
    const toggleMoreAccounts = function () {
      ms.data.showingMoreAccounts = !ms.data.showingMoreAccounts;
      acs.data.showAcctsMore = !acs.data.showAcctsMore;
    };
    const toggleChart = function () {
      ms.data.showingChart = !ms.data.showingChart;
      as.data.showAdd = !as.data.showAdd;
      cs.data.showChart = !cs.data.showChart;
      cs.renderChart();
    };

    return {
      setFlags: setFlags,
      toggleMoreAccounts: toggleMoreAccounts,
      toggleChart: toggleChart
    };
  };
})(window.angular);
