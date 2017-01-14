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
			city: null,
			cities: null,
			CURRENCY: C.CURRENCY
		};
		var loadCities = function() {
			console.log('Loading cities @ vDB...');
			// TODO - Ajax load city list from DB
			this.data.cities = V.cities;
			this.data.city = V.defaultCity;
		};
		return {
			data: data,
			loadCities: loadCities
		};
	}

})(window.angular);
