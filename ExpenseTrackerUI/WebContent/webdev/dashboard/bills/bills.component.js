/** ** ./dashboard/bills/bills.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.bills').component('bills', {
		templateUrl: 'dashboard/bills/bills.htm',
		controller: BillsController
	});

	BillsController.$inject = ['billsService', 'explistService', 'billpayService', 'CONSTANTS',
			'$location'];
	function BillsController(bs, els, bps, C, $location) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.hasPrevPage = hasPrevPage;
		vm.hasNextPage = hasNextPage;
		vm.prevPage = prevPage;
		vm.nextPage = nextPage;
		vm.showBillPay = showBillPay;
		vm.filterExpenses = filterExpenses;
		vm.clearFilter = clearFilter;

		// ***** Function declarations *****//
		function init() {
			vm.data = bs.data;
		}

		function hasPrevPage() {
			return bs.data.currPageNo > 0;
		}

		function hasNextPage() {
			return bs.data.currPageNo < bs.data.maxPageNo;
		}

		function prevPage() {
			bs.data.currPageNo -= 1;
			bs.loadDataForPage();
		}

		function nextPage() {
			bs.data.currPageNo += 1;
			bs.loadDataForPage();
		}

		function showBillPay(id) {
			bps.loadBill(id);
			$('#model_BillPay').modal('show');
		}

		function filterExpenses(id) {
			var expenses = bs.getExpenses(id);
			els.loadData(expenses);
			els.data.filterApplied = true;
		}

		function clearFilter() {
			bs.loadAllBills();
		}
	}
})(window.angular);
