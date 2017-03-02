/** ** ./dashboard/dashboardwrapper.service.js *** */

(function (angular) {
  'use strict';

  const dashboardwrapperService = function (ds, ms, acs, ss, els, elws, bs, cs, aj, $timeout) {
    const wait = 200;
    const stepFive = function () {
			// don't wait for Step 4 to be complete... Reduces the page loading time.
      ms.data.loading = false;
      ds.data.loading.on = false;
    };
    const stepFour = function () {
      if (ds.data.loading.donestep === 3) {
				// cs.loadChart();
        stepFive();
      } else {
        $timeout(function () {
          stepFour();
        }, wait);
      }
    };
    const stepThree = function () {
      if (ds.data.loading.donestep === 2) {
        elws.reloadExpenses();
        stepFour();
      } else {
        $timeout(function () {
          stepThree();
        }, wait);
      }
    };
    const stepTwo = function () {
      if (ds.data.loading.donestep === 1) {
        bs.loadAllBills();
        stepThree();
      } else {
        $timeout(function () {
          stepTwo();
        }, wait);
      }
    };
    const stepOne = function () {
      acs.loadAllAccounts();
      stepTwo();
    };
    const loadPage = function () {
      ms.data.loading = true;
      ds.data.loading.on = true;
      ds.data.loading.donestep = 0;
      stepOne();
    };
    const initialize = function () {
      els.data.thinList = true;
      els.data.thinListToggle = false;

			// temporarily resize the EXPLIST to fit the page, until the search reloads the list.
      els.data.currPageNo = 0;
      els.loadCurrentPage();
      ss.initializeData();

      acs.data.filterBy = null;
      bs.data.filterApplied = false;
      bs.data.filterBy = null;
    };

    return {
      loadPage: loadPage,
      initialize: initialize
    };
  };

  angular.module('dashboard').factory('dashboardwrapperService', dashboardwrapperService);
  dashboardwrapperService.$inject = ['dashboardService', 'etmenuService', 'accountsService',
    'searchService', 'explistService', 'explistwrapperService', 'billsService',
    'chartService', 'ajaxService', '$timeout'];
})(window.angular);
