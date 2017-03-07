/** ** ./dashboard/edit/edit.service.js *** */

(function (angular) {
  'use strict';

  const editService = function (ms, elws, acs, aj, us, V) {
    const data = {
      expense: {},
      loading: false
    };

		// load Bills
    const loadBillData = function (dt) {
      V.data.bills = dt.data;
    };
    const loadBills = function () {
      const input = {
        acctId: data.expense.accounts.from.id,
      };

      aj.query('/dashboard/bills', input, loadBillData);
    };

		// load Page Data
    const loadData = function (dt) {
      data.expense = dt;
			// initialize Bills TA.
      if (data.expense.accounts.from.id) {
        loadBills();
      }
    };

		// modify Expense
    const buildModifyInput = function () {
      const input = {
        city: data.expense.city,
        id: data.expense.id,
        fromAccount: data.expense.fromAccount,
        description: data.expense.description,
        amount: data.expense.amount,
        transDate: data.expense.transDate,
        adjust: data.expense.adjust
      };

      if (data.expense.adjust) {
        input.toAccount = data.expense.toAccount;
      } else {
        input.bill = data.expense.bill;
        input.category = data.expense.category;
        input.adhoc = data.expense.adhoc;
      }
      return input;
    };
    const loadModifyData = function () {
      data.loading = false;
      elws.modifyItem(data.expense.id);

      if (data.expense.accounts.from.id) {
        acs.refreshAccount(data.expense.accounts.from.id);
      }
      if (data.expense.accounts.to.id) {
        acs.refreshAccount(data.expense.accounts.to.id);
      }

      us.showMsg('Modify Expense', 'success');
      $('#model_Modify').modal('hide');
    };
    const modifyExpense = function () {
      aj.post('/edit/modify', buildModifyInput(), loadModifyData);
      data.loading = true;
    };

		// delete Expense
    const loadDeleteData = function () {
      data.loading = false;
      elws.deleteItem(data.expense.id);

      if (data.expense.accounts.from.id) {
        acs.refreshAccount(data.expense.accounts.from.id);
      }
      if (data.expense.accounts.to.id) {
        acs.refreshAccount(data.expense.accounts.to.id);
      }

      us.showMsg('Delete Expense', 'success');
      $('#model_Delete').modal('hide');
    };
    const deleteExpense = function () {
      aj.post('/edit/delete/' + data.expense.id, {},
					loadDeleteData);
      data.loading = true;
    };

    return {
      data: data,
      loadData: loadData,
      modifyExpense: modifyExpense,
      deleteExpense: deleteExpense,
      loadBills: loadBills
    };
  };

  angular.module('dashboard.edit').factory('editService', editService);
  editService.$inject = ['etmenuService', 'explistwrapperService', 'accountsService',
    'ajaxService', 'utilsService', 'VALUES'];
})(window.angular);
