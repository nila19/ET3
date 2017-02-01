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
			var input = {
				acctId: data.expense.fromAccount.id,
			};
			aj.query('/entry/bills/all', input, loadBillData);
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
		var buildModifyInput = function() {
			var input = {
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
		var loadModifyData = function() {
			data.loading = false;
			elws.modifyItem(data.expense.id);
			us.showMsg('Modify Expense', 'success');
			$('#model_Modify').modal('hide');
		};
		var modifyExpense = function() {
			aj.post('/entry/modify', buildModifyInput(), loadModifyData);
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
