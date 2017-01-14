/** ** ./dashboard/edit/edit.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.edit').component('edit', {
		templateUrl: 'dashboard/edit/edit.htm',
		controller: EditController
	});

	EditController.$inject = ['editService', 'CONSTANTS', 'VALUES', '$location'];
	function EditController(es, C, V, $location) {
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
					es.data.data.cat.id = item.id;
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
					es.data.data.fromAc.id = item.id;
					return item;
				}
			});
			$('#m_toAccount').typeahead({
				source: V.accounts,
				minLength: 0,
				updater: function(item) {
					es.data.data.toAc.id = item.id;
					return item;
				}
			});
		}

		function saveExpense() {
			// TODO Validate the form.
			es.saveExpense();
			$('#model_Modify').modal('hide');
		}

		function deleteExpense() {
			es.deleteExpense();
			$('#model_Delete').modal('hide');
		}
	}
})(window.angular);
