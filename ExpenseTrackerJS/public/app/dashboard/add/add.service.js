/** ** ./dashboard/add/add.service.js *** */

(function (angular) {
  'use strict';

  const addService = function (ms, acs, elws, aj, us, C) {
    const data = {
      showAdd: false,
      city: null,
      adjust: false,
      adhoc: false,
      category: null,
      fromAccount: null,
      toAccount: null,
      description: '',
      amount: '',
      transDate: ''
    };

    const buildAddInput = function () {
      const input = {
        city: ms.data.menu.city,
        fromAccount: data.fromAccount,
        description: data.description,
        amount: data.amount,
        transDate: data.transDate,
        adjust: data.adjust
      };

      if (data.adjust) {
        input.toAccount = data.toAccount;
      } else {
        input.category = data.category;
        input.adhoc = data.adhoc;
      }
      return input;
    };
    const initForm = function () {
      data.amount = '';
      data.description = '';
    };
    const loadData = function (dt) {
      initForm();
      us.showMsg('Add Expense', C.MSG.SUCCESS);
			// add the newly added Expense to the top of the Expenselist..
      elws.addItem(dt.id);

      if (data.fromAccount && data.fromAccount.id) {
        acs.refreshAccount(data.fromAccount.id);
      }
      if (data.toAccount && data.toAccount.id) {
        acs.refreshAccount(data.toAccount.id);
      }
    };
    const addExpense = function () {
      aj.post('/edit/add', buildAddInput(), loadData);
    };

    return {
      data: data,
      addExpense: addExpense
    };
  };

  angular.module('dashboard.add').factory('addService', addService);
  addService.$inject = ['etmenuService', 'accountsService', 'explistwrapperService',
    'ajaxService', 'utilsService', 'CONSTANTS'];
})(window.angular);
