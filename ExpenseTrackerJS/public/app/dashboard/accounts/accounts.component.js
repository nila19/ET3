/** ** ./dashboard/accounts/accounts.component.js *** */

(function (angular) {
  'use strict';

  const AccountsController = function (acs, ds, bs, elws) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = acs.data;
    };
    const filterAccount = function (id) {
			// if same account is already selected, do nothing.
      if (acs.data.filterBy !== id) {
        acs.filterAccount(id);
        elws.reloadExpenses();
      }
    };
    const tallyAccount = function (id) {
      acs.tallyAccount(id);
    };

    init();

		// ***** exposed functions ******//
    vm.filterAccount = filterAccount;
    vm.tallyAccount = tallyAccount;
  };

  angular.module('dashboard.accounts').component('accounts', {
    templateUrl: 'dashboard/accounts/accounts.htm',
    controller: AccountsController
  });
  AccountsController.$inject = ['accountsService', 'dashboardService', 'billsService', 'explistwrapperService'];
})(window.angular);
