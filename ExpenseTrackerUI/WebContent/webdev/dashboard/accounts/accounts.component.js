/** ** ./dashboard/accounts/accounts.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.accounts').component('accounts', {
		templateUrl: 'dashboard/accounts/accounts.htm',
		controller: AccountsController
	});

	AccountsController.$inject = ['accountsService', 'dashboardService', 'billsService',
			'explistService'];
	function AccountsController(acs, ds, bs, els) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.filterAccount = filterAccount;
		vm.tallyAccount = tallyAccount;

		// ***** Function declarations *****//
		function init() {
			vm.data = acs.data;
		}

		// FIXME - Make this as a Toggle.
		function filterAccount(id) {
			ds.account = id;

			bs.loadData(acs.getBills(id));
			bs.data.filterApplied = true;

			els.loadData(acs.getExpenses(id));
			els.data.filterApplied = true;
		}

		function tallyAccount(id) {
			acs.tallyAccount(id);
		}
	}
})(window.angular);
