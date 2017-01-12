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
		vm.filterExp = filterExp;
		vm.clearFilter = clearFilter;

		// ***** Function declarations *****//
		function init() {
			clearFilter();
			vm.data = bs.pgData;
		}

		function hasPrevPage() {
			return bs.currPageNo > 0;
		}

		function hasNextPage() {
			return bs.currPageNo < bs.maxPageNo;
		}

		function prevPage() {
			bs.currPageNo -= 1;
			bs.loadDataForPage();
		}

		function nextPage() {
			bs.currPageNo += 1;
			bs.loadDataForPage();
		}

		function showBillPay(id) {
			bps.fetchBill(id);
			$('#model_BillPay').modal('show');
		}

		function filterExp(id) {
			var result = bs.getExpForBill(id);
			els.loadData(result);
		}

		function clearFilter() {
			bs.getAllBills();
		}
	}
})(window.angular);
