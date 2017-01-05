/** ** ./dashboard/bills/bills.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.bills').component('bills', {
		templateUrl: 'dashboard/bills/bills.htm',
		controller: BillsController
	});

	BillsController.$inject = ['billsService', 'CONSTANTS', '$location'];
	function BillsController(bs, CONSTANTS, $location) {
		var vm = this;

		// /////////////////////
	}
})(window.angular);
