/** ** ./dashboard/edit/edit.component.js *** */

(function (angular) {
  'use strict';

  const EditController = function (es, els, us, V, C) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = es.data;
      vm.ta = V.data;
    };
    const modifyExpense = function (valid) {
      if (valid) {
        // clear bill if it does not belong to the same from account.
        if(es.data.expense.accounts.from.id && es.data.expense.bill) {
          if(es.data.expense.accounts.from.id !== es.data.expense.bill.account.id) {
            delete es.data.expense.bill;
          }
        }

        if (es.data.expense.adjust && (isNull(es.data.expense.accounts.from) && isNull(es.data.expense.accounts.to))) {
          us.show('1 - Mandatory fields are empty!!', C.MSG.WARNING);
          return false;
        }
        if (!es.data.expense.adjust && (isNull(es.data.expense.accounts.from) || isNull(es.data.expense.category))) {
          us.show('2 - Mandatory fields are empty!!', C.MSG.WARNING);
          return false;
        }
        if (!es.data.expense.adjust && es.data.expense.accounts.from.billed && isNull(es.data.expense.bill)) {
          us.show('3 - Mandatory fields are empty!!', C.MSG.WARNING);
          return false;
        }
        es.modifyExpense();
      }
    };
    const isNull = function (e) {
      return !e || !e.id;
    };
    const loadBills = function () {
      if (!isNull(es.data.expense.accounts.from) && es.data.expense.accounts.from.billed) {
        es.loadBills();
      }
    };
    const clearBills = function () {
      V.data.bills = [];
    };
    const deleteExpense = function () {
      es.deleteExpense();
    };

    init();

    // ***** exposed functions ******//
    vm.modifyExpense = modifyExpense;
    vm.deleteExpense = deleteExpense;
    vm.loadBills = loadBills;
    vm.clearBills = clearBills;
  };

  angular.module('dashboard.edit').component('edit', {
    templateUrl: 'dashboard/edit/edit.htm',
    controller: EditController
  });
  EditController.$inject = ['editService', 'explistService', 'utilsService', 'VALUES', 'CONSTANTS'];
})(window.angular);
