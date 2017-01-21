/** ** ./dashboard/explist/explistwrapper.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').factory('explistwrapperService', explistwrapperService);

	explistwrapperService.$inject = ['explistService', 'etmenuService', 'searchService',
			'accountsService', 'billsService', 'editService', 'ajaxService', 'CONSTANTS',
			'$timeout'];
	function explistwrapperService(els, ms, ss, acs, bs, es, aj, C, $timeout) {

		var reloadExpenses = function() {
			if (ms.data.page === C.PAGES.SEARCH) {
				ss.doSearch();
			} else if (ms.data.page === C.PAGES.DASHBOARD) {
				var list = null;
				if (bs.data.filterBy) {
					console.log('Filtering expenses for Bill @ vDB :: ' + bs.data.filterBy);
					// Filter by Bill
					list = [];
				} else if (acs.data.filterBy) {
					console.log('Filtering expenses for Account @ vDB :: ' + acs.data.filterBy);
					// Filter by Account
					list = [];
				} else {
					console.log('Getting all expenses @ vDB');
					list = [];
				}
				// TODO Ajax fetch all expenses.
				els.loadData(list);
				console.log('Loading Expenses @ vDB...' + ms.data.menu.city.name);
			}
		};

		var clearFilter = function() {
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
		};

		var editExpense = function(transId) {
			// No need to fetch from DB. Fetch from local & show in popup.
			var trans = els.data.rows[els.getIndexOf(transId)];
			es.loadData(trans);
		};

		// Swap Expenses.
		var swapPool = [];
		var tempPool = [];
		var publishing = false;
		var looperOn = false;
		var resetSwapPool = function() {
			angular.forEach(tempPool, function(temp) {
				var idx = -1;
				for (var i = 0; i < swapPool.length; i++) {
					if (temp.code === swapPool[i].code) {
						idx = i;
						break;
					}
				}
				if (idx > -1) {
					swapPool.splice(idx, 1);
				}
			});
			publishing = false;
			els.data.loading = false;
		};
		var publishSwap = function() {
			tempPool = [];
			angular.forEach(swapPool, function(swap) {
				tempPool.push(swap);
			});

			console.log('Publishing swaps...' + tempPool.length);
			els.data.loading = true;
			aj.post('/entry/swap', tempPool, resetSwapPool);
		};
		var looper = function() {
			if (swapPool.length > 0) {
				if (!publishing) {
					publishing = true;
					publishSwap();
				}
				$timeout(function() {
					looper();
				}, 3000);
			} else {
				looperOn = false;
			}
		};
		var swapExpense = function(idx1, idx2) {
			var transId1 = els.data.rows[idx1].transId;
			var transId2 = els.data.rows[idx2].transId;

			var code = transId1 * 10 + transId2; // Unique code to identify.
			swapPool.push({
				code: code,
				fromTrans: transId1,
				toTrans: transId2
			});

			// Swap them in the $view.
			var trans1 = els.data.rows[idx1];
			els.data.rows[idx1] = els.data.rows[idx2];
			els.data.rows[idx2] = trans1;
			els.loadDataForPage();

			if (!looperOn) {
				looperOn = true;
				$timeout(function() {
					looper();
				}, 3000);
			}
		};

		return {
			clearFilter: clearFilter,
			reloadExpenses: reloadExpenses,
			editExpense: editExpense,
			swapExpense: swapExpense
		};
	}

})(window.angular);
