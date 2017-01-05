/** ** ./dashboard/dashboard.module.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard', ['core', 'menu', 'dashboard.accounts', 'dashboard.add',
			'dashboard.bills', 'dashboard.chart', 'dashboard.edit', 'dashboard.explist']);

})(window.angular);
