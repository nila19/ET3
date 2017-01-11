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
		vm.data = es.data;

		init();

		// ***** Exposed functions ******//
		vm.saveExp = saveExp;
		vm.deleteExp = deleteExp;

		// ***** Function declarations *****//
		function init() {
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

		function saveExp() {
			// TODO Validate the form.
			es.saveExp();
			$('#model_Modify').modal('hide');
		}

		function deleteExp() {
			es.deleteExp();
			$('#model_Delete').modal('hide');
		}
	}
})(window.angular);
