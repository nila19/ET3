/** ** ./core/services/utils.service.js *** */

(function(angular) {
	'use strict';

	angular.module('core.services').factory('utilsService', utilsService);

	utilsService.$inject = ['CONSTANTS', '$resource'];
	function utilsService(C, $resource) {
		return {
			getURL: getURL,
			getById: getById,
			showMsg: showMsg,
			show: show
		};
		// /////////////////////
		function getURL(func) {
			var url = C.BASE_URL + C.URLs[func];
			// return $http.post(url,obj);
			return $resource(url);
		}

		function getById(arr, id) {
			var o = null;
			arr.forEach(function(obj) {
				if (obj.id === Number(id)) {
					o = obj;
				}
			});
			return o;
		}

		// Popup message
		function showMsg(action, t) {
			var msg = '<b>' + action + '</b> - Completed successfully.';
			show(msg, t);
		}

		function show(msg, t) {
			// var t = type ? C.MSG[type] : C.MSG.INFO;
			$.notify({
				icon: 'notifications',
				message: msg
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
