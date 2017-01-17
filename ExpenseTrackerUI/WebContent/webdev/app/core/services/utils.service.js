/** ** ./core/services/utils.service.js *** */

(function(angular) {
	'use strict';

	angular.module('core.services').factory('utilsService', utilsService);

	utilsService.$inject = ['CONSTANTS'];
	function utilsService(C) {
		return {
			getById: getById,
			showMsg: showMsg,
			show: show
		};

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
			$.notify({
				icon: 'notifications',
				message: msg
			}, {
				type: t,
				delay: 2000,
				placement: {
					from: 'top',
					align: 'center'
				}
			});
		}

	}

})(window.angular);
