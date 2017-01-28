/** ** ./etmenu/etmenu.service.js *** */

(function(angular) {
	'use strict';

	angular.module('etmenu').factory('etmenuService', etmenuService);

	etmenuService.$inject = ['CONSTANTS', 'VALUES'];
	function etmenuService(C, V) {
		var data = {
			page: '',
			showButtons: false,
			showingMoreAccounts: false,
			showingChart: false,
			loading: false,
			menu: {
				city: {},
				cities: [],
			},
			CURRENCY: C.CURRENCY
		};

		var loadCities = function() {
			data.menu = V.data;
		};
		var checkInit = function() {
			if (!data.menu || !data.menu.city || !data.menu.city.name) {
				loadCities();
			}
		};
		return {
			data: data,
			checkInit: checkInit
		};
	}

})(window.angular);
