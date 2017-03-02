/** ** ./core/services/utils.service.js *** */

(function(angular) {
	'use strict';

	angular.module('core.services').factory('utilsService', utilsService);

	utilsService.$inject = ['CONSTANTS'];
	function utilsService(C) {
		var getObjectOf = function(arr, id) {
			var o = null;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].id === Number(id)) {
					o = arr[i];
					break;
				}
			}
			return o;
		};
		var getIndexOf = function(arr, id) {
			var idx = null;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].id === Number(id)) {
					idx = i;
					break;
				}
			}
			return idx;
		};

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

		return {
			getObjectOf: getObjectOf,
			getIndexOf: getIndexOf,
			showMsg: showMsg,
			show: show
		};
	}

})(window.angular);
