/** ** ./dashboard/edit/edit.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.edit').factory('editService', editService);

	editService.$inject = ['etmenuService', 'explistwrapperService', 'ajaxService', 'utilsService',
			'VALUES', 'CONSTANTS'];
	function editService(ms, elws, aj, us, V, C) {
		var data = {
			expense: {},
			loading: false
		};
		var ta = {};

		// Load Bills
		var loadBillData = function(dt) {
			V.data.bills = dt;
		};
		var loadBills = function() {
			aj.query('/entry/bills/' + data.expense.fromAccount.id, {}, loadBillData);
		};

		// Load Page Data
		var loadData = function(dt) {
			data.expense = dt;
			// Initialize Bills TA.
			if (data.expense.fromAccount.id) {
				loadBills();
			}
		};

		// Modify Expense
		var loadModifyData = function() {
			data.loading = false;
			elws.modifyItem(data.expense.id);
			us.showMsg('Modify Expense', 'success');
			$('#model_Modify').modal('hide');
		};
		var modifyExpense = function() {
			aj.post('/entry/modify', data.expense, loadModifyData);
			data.loading = true;
		};

		// Delete Expense
		var loadDeleteData = function() {
			data.loading = false;
			elws.deleteItem(data.expense.id);
			us.showMsg('Delete Expense', 'success');
			$('#model_Delete').modal('hide');
		};
		var deleteExpense = function() {
			aj.post('/entry/delete/' + ms.data.menu.city.id + '/' + data.expense.id, {},
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
	}

})(window.angular);
