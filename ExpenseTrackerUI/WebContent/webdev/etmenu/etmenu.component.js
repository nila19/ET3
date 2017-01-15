/** ** ./etmenu/etmenu.component.js *** */

(function(angular) {
	'use strict';

	angular.module('etmenu').component('etmenu', {
		templateUrl: 'etmenu/etmenu.htm',
		controller: ETMenuController
	});

	ETMenuController.$inject = ['etmenuService', 'dashboardService', 'utilsService', 'CONSTANTS'];
	function ETMenuController(ms, ds, us, C) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.toggleMoreAccounts = toggleMoreAccounts;
		vm.toggleChart = toggleChart;
		vm.changeCity = changeCity;

		// ***** Function declarations *****//
		function init() {
			if (!ms.data || !ms.data.city || !ms.data.cities) {
				ms.loadCities();
			}

			vm.data = ms.data;
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
			ms.data.city = us.getById(ms.data.cities, id);
		}
	}
})(window.angular);
