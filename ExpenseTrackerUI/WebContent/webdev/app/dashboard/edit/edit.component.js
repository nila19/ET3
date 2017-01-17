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
		vm.saveExpense = saveExpense;
		vm.deleteExpense = deleteExpense;

		// ***** Function declarations *****//
		function init() {
			vm.data = es.data;
			typeAheads();
		}

		function typeAheads() {
			vm.ta = {};
			vm.ta.descriptions = V.descriptions;
			vm.ta.categories = V.categories;
			vm.ta.accounts = V.accounts;
		}

		function saveExpense(valid) {
			// TODO Validate the form.
			if (valid) {
				if (es.data.expense.adjust &&
						(isNull(es.data.expense.fromAcc) && isNull(es.data.expense.toAcc))) {
					us.show('Mandatory fields are empty!!', C.MSG.WARNING);
					return false;
				}
				if (!es.data.expense.adjust &&
						(isNull(es.data.expense.fromAcc) || isNull(es.data.expense.category))) {
					us.show('Mandatory fields are empty!!', C.MSG.WARNING);
					return false;
				}
				if (!es.data.expense.adjust && es.data.expense.fromAcc.doBills &&
						isNull(es.data.expense.bill)) {
					us.show('Mandatory fields are empty!!', C.MSG.WARNING);
					return false;
				}
				es.saveExpense();
				els.loadAllExpenses();
				$('#model_Modify').modal('hide');
			}
		}

		function isNull(e) {
			return !e || !e.id;
		}

		function getBills() {
			if (!isNull(es.data.expense.fromAcc)) {
				return es.getBillsForAcc();
			}
		}

		function deleteExpense() {
			es.deleteExpense();
			els.loadAllExpenses();
			$('#model_Delete').modal('hide');
		}
	}
})(window.angular);
