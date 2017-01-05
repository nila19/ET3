/** ** ./dashboard/dashboard.module.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard', ['core', 'services', 'nav', 'dashboard.accounts', 'dashboard.add',
			'dashboard.bills', 'dashboard.edit', 'dashboard.chart', 'dashboard.explist']);

})(window.angular);
