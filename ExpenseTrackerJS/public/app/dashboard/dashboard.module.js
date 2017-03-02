/** ** ./dashboard/dashboard.module.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard', ['core', 'etmenu', 'dashboard.accounts', 'dashboard.add',
			'dashboard.bills', 'dashboard.billpay', 'dashboard.chart', 'dashboard.edit',
			'dashboard.explist']);

})(window.angular);
