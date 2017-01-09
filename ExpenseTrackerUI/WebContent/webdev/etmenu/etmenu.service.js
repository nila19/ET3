/** ** ./etmenu/etmenu.service.js *** */

(function(angular) {
	'use strict';

	angular.module('etmenu').factory('etmenuService', etmenuService);

	etmenuService.$inject = ['CONSTANTS'];
	function etmenuService(CONSTANTS) {
		var page = '';
		var city;

		var getPage = function() {
			return page;
		};
		var setPage = function(page) {
			this.page = page;
		};
		var getCity = function() {
			return city;
		};
		var setCity = function(city) {
			this.city = city;
		};

		return {
			getPage: getPage,
			setPage: setPage,
			getCity: getCity,
			setCity: setCity
		};
	}

})(window.angular);
