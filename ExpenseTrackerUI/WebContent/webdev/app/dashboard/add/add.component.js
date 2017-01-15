/** ** ./dashboard/add/add.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.add').component('add', {
		templateUrl: 'dashboard/add/add.htm',
		controller: AddController
	});

	AddController.$inject = ['addService', 'explistService', 'VALUES'];
	function AddController(as, els, V) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.addExpense = addExpense;
		vm.switchTab = switchTab;

		// ***** Function declarations *****//
		function init() {
			vm.data = as.data;
			typeAheads();
		}

		function typeAheads() {
			$('#exp_category').typeahead({
				source: V.categories,
				minLength: 0,
				updater: function(item) {
					as.data.cat.id = item.id;
					return item;
				}
			});
			$('#exp_description, #adj_description').typeahead({
				source: V.descriptions
			});
			$('#exp_fromAccount, #adj_fromAccount').typeahead({
				source: V.accounts,
				minLength: 0,
				updater: function(item) {
					as.data.fromAc.id = item.id;
					return item;
				}
			});
			$('#adj_toAccount').typeahead({
				source: V.accounts,
				minLength: 0,
				updater: function(item) {
					as.data.toAc.id = item.id;
					return item;
				}
			});
		}

		function addExpense() {
			// TODO Validate form.
			as.addExpense();
			els.loadAllExpenses();
		}

		function switchTab(code) {
			if (code === 'expense') {
				as.data.adjust = false;
				$('#' + as.data.tabs.adjustment).removeClass('active');
				$('#' + as.data.tabs.expense).addClass('active');
			} else {
				vm.data.adjust = true;
				$('#' + as.data.tabs.expense).removeClass('active');
				$('#' + as.data.tabs.adjustment).addClass('active');
			}
		}
	}
})(window.angular);
