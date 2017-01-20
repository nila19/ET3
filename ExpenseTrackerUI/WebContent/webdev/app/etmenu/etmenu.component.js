/** ** ./etmenu/etmenu.component.js *** */

(function(angular) {
	'use strict';

	angular.module('etmenu').component('etmenu', {
		templateUrl: 'etmenu/etmenu.htm',
		controller: ETMenuController
	});

	ETMenuController.$inject = ['etmenuService', 'dashboardService', 'startupService',
			'utilsService', 'CONSTANTS', 'VALUES'];
	function ETMenuController(ms, ds, sus, us, C, V) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.toggleMoreAccounts = toggleMoreAccounts;
		vm.toggleChart = toggleChart;
		vm.changeCity = changeCity;

		// ***** Function declarations *****//
		function init() {
			sus.loadCity();
			vm.data = ms.data;

			ms.checkInit();
			ms.data.showButtons = (ms.data.page === C.PAGES.DASHBOARD);
		}

		function toggleMoreAccounts() {
			console.log('Toggling more accounts..');
			ds.toggleMoreAccounts();
		}

		function toggleChart() {
			console.log('Toggling chart..');
			ds.toggleChart();
		}

		function changeCity(id) {
			V.data.city = us.getById(ms.data.menu.cities, id);
			// Refresh all items for city.
			sus.loadAll();
		}
	}
})(window.angular);
