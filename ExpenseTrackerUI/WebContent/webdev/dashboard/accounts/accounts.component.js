/** ** ./dashboard/accounts/accounts.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.accounts').component('accounts', {
		templateUrl: 'dashboard/accounts/accounts.htm',
		controller: AccountsController
	});

	AccountsController.$inject = ['accountsService', 'CONSTANTS', '$location'];
	function AccountsController(acs, CONSTANTS, $location) {
		var vm = this;

		// /////////////////////
	}
})(window.angular);
