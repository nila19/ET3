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
			vm.ta = V.data;
		}

		function isNull(e) {
			return !e || !e.id;
		}
		function addExpense(valid) {
			if (valid) {
				if (as.data.adjust && (isNull(as.data.fromAccount) && isNull(as.data.toAccount))) {
					us.show('Select at least one of From, To accounts!!', C.MSG.WARNING);
					return false;
				}
				as.addExpense();
			}
		}
	}
})(window.angular);
