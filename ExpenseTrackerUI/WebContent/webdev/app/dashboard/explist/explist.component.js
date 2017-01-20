/** ** ./dashboard/explist/explist.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').component('explist', {
		templateUrl: 'dashboard/explist/explist.htm',
		controller: ExplistController
	});

	ExplistController.$inject = ['explistService', 'editService', 'etmenuService', 'searchService',
			'accountsService', 'billsService', 'CONSTANTS'];
	function ExplistController(els, es, ms, ss, acs, bs, C) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.hasPrevPage = hasPrevPage;
		vm.hasNextPage = hasNextPage;
		vm.prevPage = prevPage;
		vm.nextPage = nextPage;
		vm.showModifyExpense = showModifyExpense;
		vm.showDeleteExpense = showDeleteExpense;
		vm.swapExpense = swapExpense;
		vm.clearFilter = clearFilter;

		// ***** Function declarations *****//
		function init() {
			vm.data = els.data;
		}

		function hasPrevPage() {
			return els.data.currPageNo > 0;
		}

		function hasNextPage() {
			return els.data.currPageNo < els.data.maxPageNo;
		}

		function prevPage() {
			els.data.currPageNo -= 1;
			els.loadDataForPage();
		}

		function nextPage() {
			els.data.currPageNo += 1;
			els.loadDataForPage();
		}

		function showModifyExpense(transId) {
			es.loadExpense(transId);
			$('#model_Modify').modal('show');
		}

		function showDeleteExpense(transId) {
			es.loadExpense(transId);
			$('#model_Delete').modal('show');
		}

		function swapExpense(transId, diff) {
			var idx = els.getIndexOf(transId);
			els.swapExpense(idx, idx + diff);
		}

		function clearFilter() {
			els.data.filterApplied = false;
			if (ms.data.page === C.PAGES.SEARCH) {
				ss.initializeData();
			} else if (ms.data.page === C.PAGES.DASHBOARD) {
				// Clear filter for Bills
				if (acs.data.filterBy) {
					bs.clearFilter();
				}
				bs.data.filterBy = null;
				acs.data.filterBy = null;
			}
			reloadExpenses();
		}

		function reloadExpenses() {
			if (ms.data.page === C.PAGES.SEARCH) {
				ss.doSearch();
			} else if (ms.data.page === C.PAGES.DASHBOARD) {
				var list = null;
				if (bs.data.filterBy) {
					console.log('Filtering expenses for Bill @ vDB :: ' + bs.data.filterBy);
					// Filter by Bill
					list = els.dummyExpenses();
				} else if (acs.data.filterBy) {
					console.log('Filtering expenses for Account @ vDB :: ' + acs.data.filterBy);
					// Filter by Account
					list = els.dummyExpenses();
				} else {
					console.log('Getting all expenses @ vDB');
					list = els.dummyExpenses();
				}
				// TODO Ajax fetch all expenses.
				els.loadData(list);
				console.log('Loading Expenses @ vDB...' + ms.data.menu.city.name);
			}
		}
	}
})(window.angular);
