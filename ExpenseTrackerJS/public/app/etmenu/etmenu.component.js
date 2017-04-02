/** ** ./etmenu/etmenu.component.js *** */

import './etmenu.module';
import './etmenu.service';

(function (angular) {
  'use strict';

  const ETMenuController = function (ms, dfs, sus, us, C, V, $location, $timeout, $route) {
    const vm = this;
    const WAIT = 500; // milliseconds

		// ***** function declarations *****//
    const init = function () {
      sus.loadAll();
      vm.data = ms.data;
      vm.data.href = C.HREF;

      ms.checkInit();
      ms.data.showButtons = (ms.data.page === C.PAGES.DASHBOARD);
    };
    const toggleMoreAccounts = function () {
      dfs.toggleMoreAccounts();
    };
    const toggleChart = function () {
      dfs.toggleChart();
    };
    const changeCity = function (id) {
      V.data.city = us.getObjectOf(ms.data.menu.cities, id);
      sus.loadOthers();
      $timeout(function () {
        checkReloadPage();
      }, WAIT);
    };
    const checkReloadPage = function () {
      if (!V.data.city.id || ms.data.loading) {
        $timeout(function () {
          checkReloadPage();
        }, WAIT);
      } else {
        $route.reload();
        $location.path(C.HREF[ms.data.page]);
      }
    };

    // ***** exposed functions ******//
    vm.toggleMoreAccounts = toggleMoreAccounts;
    vm.toggleChart = toggleChart;
    vm.changeCity = changeCity;

    init();
  };

  angular.module('etmenu').component('etmenu', {
    templateUrl: 'etmenu/etmenu.htm',
    controller: ETMenuController
  });
  ETMenuController.$inject = ['etmenuService', 'dashboardFlagsService', 'startupService', 'utilsService', 'CONSTANTS',
    'VALUES', '$location', '$timeout', '$route'];
})(window.angular);
