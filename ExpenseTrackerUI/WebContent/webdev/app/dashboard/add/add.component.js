/** ** ./dashboard/add/add.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.add').component('add', {
		templateUrl: 'dashboard/add/add.htm',
		controller: AddController
	});

	AddController.$inject = ['addService', 'explistService', 'utilsService', 'VALUES', 'CONSTANTS'];
	function AddController(as, els, us, V, C) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.addExpense = addExpense;

		// ***** Function declarations *****//
		function init() {
			vm.data = as.data;
			typeAheads();
		}

		function typeAheads() {
			vm.ta = {};
			vm.ta.descriptions = V.descriptions;
			vm.ta.categories = V.categories;
			vm.ta.months = V.months;
			vm.ta.accounts = V.accounts;
		}

		function addExpense(valid) {
			if (valid) {
				if (as.data.adjust && (!as.data.fromAcc.id && !as.data.toAcc.id)) {
					us.show('Select at least one of From, To accounts!!', C.MSG.WARNING);
					return false;
				}
				as.addExpense();
				els.loadAllExpenses();
			}
		}
	}
})(window.angular);
