/** ** ./dashboard/edit/edit.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.edit').component('edit', {
		templateUrl: 'dashboard/edit/edit.htm',
		controller: EditController
	});

	EditController.$inject = ['editService', 'explistService', 'utilsService', 'VALUES',
			'CONSTANTS'];
	function EditController(es, els, us, V, C) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.modifyExpense = modifyExpense;
		vm.deleteExpense = deleteExpense;
		vm.loadBills = loadBills;
		vm.clearBills = clearBills;

		// ***** Function declarations *****//
		function init() {
			vm.data = es.data;
			vm.ta = V.data;
		}

		function modifyExpense(valid) {
			if (valid) {
				if (es.data.expense.adjust &&
						(isNull(es.data.expense.fromAccount) && isNull(es.data.expense.toAccount))) {
					us.show('1 - Mandatory fields are empty!!', C.MSG.WARNING);
					return false;
				}
				if (!es.data.expense.adjust &&
						(isNull(es.data.expense.fromAccount) || isNull(es.data.expense.category))) {
					us.show('2 - Mandatory fields are empty!!', C.MSG.WARNING);
					return false;
				}
				if (!es.data.expense.adjust && es.data.expense.fromAccount.billed &&
						isNull(es.data.expense.bill)) {
					us.show('3 - Mandatory fields are empty!!', C.MSG.WARNING);
					return false;
				}
				es.modifyExpense();
			}
		}

		function isNull(e) {
			return !e || !e.id;
		}

		function loadBills() {
			if (!isNull(es.data.expense.fromAccount)) {
				es.loadBills();
			}
		}

		function clearBills() {
			V.data.bills = [];
		}

		function deleteExpense() {
			es.deleteExpense();
		}
	}
})(window.angular);
