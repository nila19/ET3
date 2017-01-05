/** ** ./app.module.js *** */

(function(angular) {
	'use strict';

	angular.module('app', ['core', 'dashboard', 'nav', 'search', 'summary', 'ngRoute']);

	angular.module('app').config(['$compileProvider', function($compileProvider) {
		$compileProvider.debugInfoEnabled(false);
		$compileProvider.commentDirectivesEnabled(false);
		$compileProvider.cssClassDirectivesEnabled(false);
	}]);

})(window.angular);

// TODO Remove
var appUtils = {
	// Popup message
	msg: {
		types: ['', 'info', 'success', 'warning', 'danger'],
		show: function(action) {
			$.notify({
				icon: 'notifications',
				message: '<b>' + action + '</b> - Completed successfully.'
			}, {
				type: 'success',
				delay: 1000,
				placement: {
					from: 'top',
					align: 'center'
				}
			});
		}
	}
};
