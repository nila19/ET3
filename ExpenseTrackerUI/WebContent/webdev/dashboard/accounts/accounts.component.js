/** ** ./dashboard/accounts/accounts.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.accounts').component('accounts', {
		templateUrl: 'dashboard/accounts/accounts.htm',
		controller: AccountsController
	});

	AccountsController.$inject = ['accountsService', 'billsService', 'explistService'];
	function AccountsController(acs, bs, els) {
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
			var bills = acs.getBills(id);
			bs.loadData(bills);
			bs.data.filterApplied = true;

			var expenses = acs.getExpenses(id);
			els.loadData(expenses);
			els.data.filterApplied = true;
		}

		function tallyAccount(id) {
			acs.tallyAccount(id);
		}
	}
})(window.angular);
