/** ** ./dashboard/accounts/accounts.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.accounts').component('accounts', {
		templateUrl: 'dashboard/accounts/accounts.htm',
		controller: AccountsController
	});

	AccountsController.$inject = ['accountsService', 'dashboardService', 'billsService',
			'explistwrapperService', 'explistService', 'searchService'];
	function AccountsController(acs, ds, bs, elws, els, ss) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.filterAccount = filterAccount;
		vm.tallyAccount = tallyAccount;

		// ***** Function declarations *****//
		function init() {
			vm.data = acs.data;
		}

		function filterAccount(id) {
			// If same account is already selected, do nothing.
			if (acs.data.filterBy !== id) {
				acs.filterAccount(id);
				elws.reloadExpenses();
			}
		}

		function tallyAccount(id) {
			acs.tallyAccount(id);
		}
	}
})(window.angular);
