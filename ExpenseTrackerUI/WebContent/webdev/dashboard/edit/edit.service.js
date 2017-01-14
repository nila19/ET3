/** ** ./dashboard/edit/edit.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.edit').factory('editService', editService);

	editService.$inject = ['editFunctionsService', 'CONSTANTS'];
	function editService(efs, C) {
		var data = {
			id: 0,
			data: {}
		};

		var fetchExpense = function(id) {
			efs.fetchExpense(id, this.data);
		};
		var saveExpense = function() {
			return efs.saveExpense(this.data);
			// TODO Refresh exp list.
		};
		var deleteExpense = function() {
			return efs.deleteExpense(this.data.id);
			// TODO Refresh exp list.
		};
		var swapExpense = function(id1, id2) {
			return efs.swapExpense(id1, id2);
			// TODO Refresh exp list.
		};

		return {
			data: data,
			fetchExpense: fetchExpense,
			saveExpense: saveExpense,
			deleteExpense: deleteExpense,
			swapExpense: swapExpense
		};
	}

})(window.angular);
