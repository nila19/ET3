/** ** ./dashboard/edit/edit.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.edit').component('edit', {
		templateUrl: 'dashboard/edit/edit.htm',
		controller: EditController
	});

	EditController.$inject = ['editService', 'explistService', 'VALUES'];
	function EditController(es, els, V) {
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
			$('#m_category').typeahead({
				source: V.categories,
				minLength: 0,
				updater: function(item) {
					es.data.expense.cat.id = item.id;
					return item;
				}
			});
			$('#m_description').typeahead({
				source: V.descriptions
			});
			$('#m_fromAccount').typeahead({
				source: V.accounts,
				minLength: 0,
				updater: function(item) {
					es.data.expense.fromAc.id = item.id;
					return item;
				}
			});
			$('#m_toAccount').typeahead({
				source: V.accounts,
				minLength: 0,
				updater: function(item) {
					es.data.expense.toAc.id = item.id;
					return item;
				}
			});
		}

		function saveExpense() {
			// TODO Validate the form.
			es.saveExpense();
			els.loadAllExpenses();
			$('#model_Modify').modal('hide');
		}

		function deleteExpense() {
			es.deleteExpense();
			els.loadAllExpenses();
			$('#model_Delete').modal('hide');
		}
	}
})(window.angular);
