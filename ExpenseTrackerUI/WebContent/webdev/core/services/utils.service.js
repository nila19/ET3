/** ** ./core/services/utils.service.js *** */

(function(angular) {
	'use strict';

	angular.module('core.services').factory('utilsService', utilsService);

	utilsService.$inject = ['CONSTANTS', '$resource'];
	function utilsService(CONSTANTS, $resource) {
		return {
			getURL: getURL,
			showMsg: showMsg
		};
		// /////////////////////
		function getURL(func) {
			var url = CONSTANTS.BASE_URL + CONSTANTS.URLs[func];
			// return $http.post(url,obj);
			return $resource(url);
		}

		// Popup message
		function showMsg(action, type) {
			var t = type ? CONSTANTS.MSG[type] : CONSTANTS.MSG.INFO;
			$.notify({
				icon: 'notifications',
				message: '<b>' + action + '</b> - Completed successfully.'
			}, {
				type: t,
				delay: 1000,
				placement: {
					from: 'top',
					align: 'center'
				}
			});
		}

	}

})(window.angular);
