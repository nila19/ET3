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
		vm.hasPrevPageSet = hasPrevPageSet;
		vm.hasNextPageSet = hasNextPageSet;
		vm.prevPageSet = prevPageSet;
		vm.nextPageSet = nextPageSet;
		vm.page = page;
		vm.loadPage = loadPage;
		vm.showBillPay = showBillPay;
		vm.filterExpenses = filterExpenses;
		vm.clearFilter = clearFilter;

		// ***** Function declarations *****//
		function init() {
			vm.data = bs.data;
		}

		function hasPrevPageSet() {
			return bs.data.currPageSet > 0;
		}

		function hasNextPageSet() {
			return ((bs.data.currPageSet + 1) * bs.data.pageSetSize) <= bs.data.maxPageNo;
		}

		function prevPageSet() {
			bs.data.currPageSet -= 1;
		}

		function nextPageSet() {
			bs.data.currPageSet += 1;
		}

		// idx will be 0,1,2,3,4
		function page(idx) {
			return (bs.data.currPageSet * bs.data.pageSetSize) + idx;
		}

		function loadPage(pg) {
			bs.data.currPageNo = pg;
			bs.loadCurrentPage();
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
