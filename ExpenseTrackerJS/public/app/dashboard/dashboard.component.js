/** ** ./dashboard/dashboard.component.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard').component('dashboard', {
    templateUrl: 'dashboard/dashboard.htm',
    controller: DashboardController
  });

  DashboardController.$inject = ['dashboardwrapperService', 'dashboardService',
    'dashboardFlagsService', 'etmenuService', 'explistService', 'searchService',
    'CONSTANTS', 'VALUES', '$timeout'];
  const DashboardController = function (dws, ds, dfs, ms, els, ss, C, V, $timeout) {
    // const vm = this;
    const WAIT = 100; // milliseconds

    init();

    const init = function () {
      ms.data.page = C.PAGES.DASHBOARD;
      els.data.rowCount = C.SIZES.DASHBOARD_ROW;

			// if Menu is not loaded yet; load the default city from V.
      ms.checkInit();

      dws.initialize();
      dfs.setFlags();
      loadPage();
    };

		// load default bills & expenses once menu is loaded.
    const loadPage = function () {
      if (!V.data.city.id || ms.data.loading) {
        $timeout(function () {
          loadPage();
        }, WAIT);
      } else {
        dws.loadPage();
      }
    };
  };
})(window.angular);
