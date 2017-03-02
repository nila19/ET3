/** ** ./dashboard/accounts/accounts.component.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.accounts').component('accounts', {
    templateUrl: 'dashboard/accounts/accounts.htm',
    controller: AccountsController
  });

  AccountsController.$inject = ['accountsService', 'dashboardService', 'billsService', 'explistwrapperService'];
  const AccountsController = function (acs, ds, bs, elws) {
    const vm = this;

    init();

		// ***** exposed functions ******//
    vm.filterAccount = filterAccount;
    vm.tallyAccount = tallyAccount;

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
  };
})(window.angular);
