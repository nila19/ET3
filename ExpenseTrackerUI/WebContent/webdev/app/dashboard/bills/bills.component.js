/** ** ./dashboard/bills/bills.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.bills').component('bills', {
		templateUrl: 'dashboard/bills/bills.htm',
		controller: BillsController
	});

	BillsController.$inject = ['billswrapperService', 'billsService', 'explistwrapperService',
			'explistService', 'searchService'];
	function BillsController(bws, bs, elws, els, ss) {
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
			bws.showBillPay(id);
			$('#model_BillPay').modal('show');
		}

		function filterExpenses(id) {
			// If same bill is already selected, do nothing.
			if (bs.data.filterBy !== id) {
				bs.data.filterBy = id;
				ss.data.bill = {
					id: id
				};
				ss.data.account = null;
				elws.reloadExpenses();
			}
		}

		function clearFilter() {
			elws.clearFilter();
		}
	}
})(window.angular);
