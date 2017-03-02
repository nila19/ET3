/** ** ./etmenu/etmenu.component.js *** */

(function(angular) {
	'use strict';

	angular.module('etmenu').component('etmenu', {
		templateUrl: 'etmenu/etmenu.htm',
		controller: ETMenuController
	});

	ETMenuController.$inject = ['etmenuService', 'dashboardFlagsService', 'startupService',
			'utilsService', 'CONSTANTS', 'VALUES', '$location', '$timeout', '$route'];
	function ETMenuController(ms, dfs, sus, us, C, V, $location, $timeout, $route) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.toggleMoreAccounts = toggleMoreAccounts;
		vm.toggleChart = toggleChart;
		vm.changeCity = changeCity;

		// ***** Function declarations *****//
		function init() {
			sus.loadAll();
			vm.data = ms.data;
			vm.data.href = C.HREF;

			ms.checkInit();
			ms.data.showButtons = (ms.data.page === C.PAGES.DASHBOARD);
		}

		function toggleMoreAccounts() {
			dfs.toggleMoreAccounts();
		}

		function toggleChart() {
			dfs.toggleChart();
		}

		function changeCity(id) {
			V.data.city = us.getObjectOf(ms.data.menu.cities, id);
			sus.loadOthers();
			$timeout(function() {
				checkReloadPage();
			}, 500);
		}

		function checkReloadPage() {
			if (!V.data.city.id || ms.data.loading) {
				$timeout(function() {
					checkReloadPage();
				}, 500);
			} else {
				$route.reload();
				$location.path(C.HREF[ms.data.page]);
			}
		}

		function reloadCurrentPage() {
			if (ms.data.page === C.PAGES.DASHBOARD) {
				$location.path('/dashboard');
			}
			if (ms.data.page === C.PAGES.SUMMARY) {
				$location.path('/summary');
			}
			if (ms.data.page === C.PAGES.SEARCH) {
				$location.path('/search');
			}
		}
	}
})(window.angular);
