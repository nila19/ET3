/** ** ./dashboard/edit/edit.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.edit').factory('editService', editService);

	editService.$inject = ['explistService', 'ajaxService', 'utilsService', 'VALUES', 'CONSTANTS',
			'$http'];
	function editService(els, aj, us, V, C, $http) {
		var data = {
			expense: {},
			loading: false
		};
		var ta = {};

		var dummyBills = function() {
			return [{
				id: 20,
				name: 'BOA - 7787 - Bill #1'
			}, {
				id: 21,
				name: 'BOA - 7787 - Bill #2'
			}, {
				id: 22,
				name: 'BOA - 7787 - Bill #3'
			}];
		};
		var loadData = function(data) {
			this.data.expense = data;
		};

		// Modify Expense
		var loadModifyData = function() {
			data.loading = false;
			us.showMsg('Modify Expense', 'success');
			$('#model_Modify').modal('hide');
		};
		var saveExpense = function() {
			aj.post('/entry/modify', this.data.expense, loadModifyData);
			this.data.loading = true;
			// TODO Ajax save.
			console.log('Changes saving @ DB :: ' + JSON.stringify(this.data.expense));
		};

		// Delete Expense
		var loadDeleteData = function() {
			data.loading = false;
			els.reloadListAfterDelete(data.expense.transId);
			us.showMsg('Delete Expense', 'success');
			$('#model_Delete').modal('hide');
		};
		var deleteExpense = function() {
			aj.post('/entry/delete/' + this.data.expense.transId, {}, loadDeleteData);
			this.data.loading = true;
		};

		var loadBills = function() {
			aj.query('/entry/bills/' + this.data.expense.fromAccount.id, {}, loadResults);
		};
		var loadResults = function(data) {
			V.data.bills = data;
		};

		return {
			data: data,
			loadData: loadData,
			saveExpense: saveExpense,
			deleteExpense: deleteExpense,
			loadBills: loadBills
		};
	}

})(window.angular);
