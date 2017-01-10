/** ** ./etmenu/etmenu.component.js *** */

(function(angular) {
	'use strict';

	angular.module('etmenu').component('etmenu', {
		templateUrl: 'etmenu/etmenu.htm',
		controller: ETMenuController
	});

	ETMenuController.$inject = ['etmenuService', 'CONSTANTS', 'VALUES', '$location', '$filter'];
	function ETMenuController(ms, C, V, $location, $filter) {
		var vm = this;
		vm.toggleMoreAccounts = toggleMoreAccounts;
		vm.toggleChart = toggleChart;
		vm.changeCity = changeCity;

		init();
		// /////////////////////

		function init() {
			vm.showButtons = (ms.getPage() === C.PAGES.DASHBOARD);
			vm.showingMoreAccounts = false;
			vm.showingChart = false;
			vm.CURRENCY = C.CURRENCY;
			vm.cities = V.cities;
			setCity(V.defaultCity);
		}

		function toggleMoreAccounts() {
			console.log('Toggling more accounts..');
			// TODO
		}

		function toggleChart() {
			console.log('Toggling chart..');
			// TODO
		}

		function changeCity(cityId) {
			setCity($filter('filter')(vm.cities, function(d) {
				return d.id === cityId;
			})[0]);
			// TODO Ajax refresh the screen.
		}

		function setCity(city) {
			vm.city = city;
			ms.setCity(city);
		}
	}
})(window.angular);
