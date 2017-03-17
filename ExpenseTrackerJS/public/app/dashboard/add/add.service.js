/** ** ./dashboard/add/add.service.js *** */

(function (angular) {
  'use strict';

  const addService = function (ms, acs, elws, aj, us) {
    const data = {
      showAdd: false,
      expense: {
        city: null,
        adjust: false,
        adhoc: false,
        category: null,
        accounts: {
          from: null,
          to: null
        },
        description: '',
        amount: '',
        transDt: ''
      }
    };

    const initForm = function () {
      data.expense.amount = '';
      data.expense.description = '';
    };
    const loadData = function (dt) {
      initForm();
      us.showMsg('Add Expense', dt.code);
      if(dt.code === 0) {
        // add the newly added Expense to the top of the Expenselist..
        elws.addItem(dt.data.id);
        if (data.expense.accounts.from && data.expense.accounts.from.id) {
          acs.refreshAccount(data.expense.accounts.from.id);
        }
        if (data.expense.accounts.to && data.expense.accounts.to.id) {
          acs.refreshAccount(data.expense.accounts.to.id);
        }
      }
    };
    const addExpense = function () {
      data.expense.city = ms.data.menu.city;
      aj.post('/edit/add', data.expense, loadData);
    };

    return {
      data: data,
      addExpense: addExpense
    };
  };

  angular.module('dashboard.add').factory('addService', addService);
  addService.$inject = ['etmenuService', 'accountsService', 'explistwrapperService',
    'ajaxService', 'utilsService'];
})(window.angular);
