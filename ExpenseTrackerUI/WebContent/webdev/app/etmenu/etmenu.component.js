/** ** ./etmenu/etmenu.component.js *** */

(function(angular) {
	'use strict';

	angular.module('etmenu').component('etmenu', {
		templateUrl: 'etmenu/etmenu.htm',
		controller: ETMenuController
	});

	ETMenuController.$inject = ['etmenuService', 'dashboardFlagsService', 'startupService',
			'utilsService', 'CONSTANTS', 'VALUES'];
	function ETMenuController(ms, dfs, sus, us, C, V) {
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
			// TODO Reload the current page
		}
	}
})(window.angular);
