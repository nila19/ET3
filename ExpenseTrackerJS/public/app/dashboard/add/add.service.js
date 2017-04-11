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

    const initializeData = function () {
      data.expense.adjust = false;
      data.expense.adhoc = false;
      data.expense.category = null;
      data.expense.accounts.from = null;
      data.expense.accounts.to = null;
      data.expense.description = '';
      data.expense.amount = '';
      data.expense.transDt = '';
    };
    const resetForm = function () {
      data.expense.description = '';
      data.expense.amount = '';
    };
    const loadData = function (dt) {
      resetForm();
      us.showMsg('Add Expense', dt.code);
      if(dt.code === 0) {
        // add the newly added Expense to the top of the Expenselist..
        elws.addItem(dt.data.id);
      }
    };
    const addExpense = function () {
      data.expense.city = ms.data.menu.city;
      aj.post('/edit/add', data.expense, loadData);
    };

    return {
      data: data,
      initializeData: initializeData,
      addExpense: addExpense
    };
  };

  angular.module('dashboard.add').factory('addService', addService);
  addService.$inject = ['etmenuService', 'accountsService', 'explistwrapperService', 'ajaxService', 'utilsService'];
})(window.angular);
