/** ** ./etmenu/etmenu.service.js *** */

(function(angular) {
	'use strict';

	angular.module('etmenu').factory('etmenuService', etmenuService);

	etmenuService.$inject = ['CONSTANTS'];
	function etmenuService(CONSTANTS) {
		var page = '';
		var city;

		return {
			page: page,
			city: city
		};
	}

})(window.angular);
