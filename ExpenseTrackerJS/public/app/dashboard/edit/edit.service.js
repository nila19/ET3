/** ** ./dashboard/edit/edit.service.js *** */

(function (angular) {
  'use strict';

  const editService = function (ms, elws, acs, bs, aj, us, V) {
    const data = {
      expense: {},
      toRefresh: {
        bills: {}
      },
      loading: false
    };

    const initRefresh = function () {
      data.toRefresh.bills = {};
    };

    // store the account ids to be refreshed after modify/delete.
    const loadRefresh = function () {
      if(data.expense.bill && data.expense.bill.id) {
        data.toRefresh.bills[data.expense.bill.id] = data.expense.bill.id;
      }
    };

    // refresh all impacted bills after modify/delete.
    const refreshAll = function () {
      angular.forEach(data.toRefresh.bills, function (value, id) {
        bs.refreshBill(id);
      });
      initRefresh();
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
      initRefresh();
      data.expense = dt;
      data.expense.amount = _.round(data.expense.amount, 2);
      // refresh the 'from' account from TA so that it will have 'billed' attribute.
      if(data.expense.accounts.from.id) {
        data.expense.accounts.from = us.getObjectOf(V.data.accounts, data.expense.accounts.from.id);
      }
      // store the account ids, bill id to be refreshed after modify/delete.
      loadRefresh();
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
        refreshAll();
      }
      $('#model_Modify').modal('hide');
    };
    const modifyExpense = function () {
      // re-store the account ids, bill id (if these are modified) to be refreshed after save.
      loadRefresh();
      aj.post('/edit/modify', data.expense, loadModifyData);
      data.loading = true;
    };

		// delete Expense
    const loadDeleteData = function (dt) {
      data.loading = false;
      us.showMsg('Delete Expense', dt.code);
      if(dt.code === 0) {
        elws.deleteItem(data.expense.id);
        refreshAll();
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
