/** ** ./dashboard/edit/edit.service.js *** */

(function (angular) {
  'use strict';

  const editService = function (ms, elws, acs, bs, aj, us, V) {
    const data = {
      expense: {},
      loading: false
    };

		// load Bills
    const loadBillData = function (dt) {
      V.data.bills = dt.data;
    };
    const loadBills = function () {
      const input = {acctId: data.expense.accounts.from.id};

      aj.query('/dashboard/bills', input, loadBillData);
    };

		// load Page Data
    const loadData = function (dt) {
      data.expense = dt;
      data.expense.amount = _.round(data.expense.amount, 2);
      // refresh the 'from' account from TA so that it will have 'billed' attribute.
      if(data.expense.accounts.from.id) {
        data.expense.accounts.from = us.getObjectOf(V.data.accounts, data.expense.accounts.from.id);
      }
			// initialize Bills TA.
      if (data.expense.accounts.from.billed) {
        loadBills();
      }
    };

		// modify Expense
    const loadModifyData = function (dt) {
      data.loading = false;
      us.showMsg('Modify Expense', dt.code);
      if(dt.code === 0) {
        elws.modifyItem(data.expense.id);
      }
      $('#model_Modify').modal('hide');
    };
    const modifyExpense = function () {
      aj.post('/edit/modify', data.expense, loadModifyData);
      data.loading = true;
    };

		// delete Expense
    const loadDeleteData = function (dt) {
      data.loading = false;
      us.showMsg('Delete Expense', dt.code);
      if(dt.code === 0) {
        elws.deleteItem(data.expense.id);
      }
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
  editService.$inject = ['etmenuService', 'explistwrapperService', 'accountsService', 'billsService', 'ajaxService',
    'utilsService', 'VALUES'];
})(window.angular);
