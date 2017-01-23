/** ** ./dashboard/explist/explistwrapper.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').factory('explistwrapperService', explistwrapperService);

	explistwrapperService.$inject = ['explistService', 'etmenuService', 'searchService',
			'accountsService', 'billsService', 'editService', 'ajaxService', 'CONSTANTS',
			'$timeout'];
	function explistwrapperService(els, ms, ss, acs, bs, es, aj, C, $timeout) {

		var reloadExpenses = function() {
			ss.doSearch();
		};

		var clearFilter = function() {
			els.data.filterApplied = false;
			ss.initializeData();
			if (ms.data.page === C.PAGES.DASHBOARD) {
				// Clear filter for Bills
				if (acs.data.filterBy) {
					bs.data.filterApplied = false;
					bs.loadAllBills();
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
			aj.post('/entry/swap/' + ms.data.menu.city.id, tempPool, resetSwapPool);
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
