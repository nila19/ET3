/** ** ./dashboard/explist/explistwrapper.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').factory('explistwrapperService', explistwrapperService);

	explistwrapperService.$inject = ['explistService', 'etmenuService', 'searchService',
			'accountsService', 'billsService', 'ajaxService', 'utilsService', 'CONSTANTS',
			'$timeout'];
	function explistwrapperService(els, ms, ss, acs, bs, aj, us, C, $timeout) {

		var reloadExpenses = function() {
			ss.data.thinList = els.data.thinList;
			ss.doSearch();
		};

		var clearFilter = function() {
			ss.initializeData();
			if (ms.data.page === C.PAGES.DASHBOARD) {
				// Clear filter for Bills
				if (acs.data.filterBy) {
					bs.data.filterApplied = false;
					bs.clearBillsList();
					bs.loadAllBills();
				}
				bs.data.filterBy = null;
				acs.data.filterBy = null;
			}
			reloadExpenses();
		};

		var loadAddItem = function(dt) {
			els.addItem(dt);
		};
		var addItem = function(id) {
			aj.get('/entry/transaction/' + id, {}, loadAddItem);
		};
		var loadModifyItem = function(dt) {
			els.modifyItem(dt);
		};
		var modifyItem = function(id) {
			aj.get('/entry/transaction/' + id, {}, loadModifyItem);
		};
		var deleteItem = function(id) {
			els.deleteItem(id);
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
			var id1 = els.data.rows[idx1].id;
			var id2 = els.data.rows[idx2].id;

			var code = id1 * 10 + id2; // Unique code to identify.
			swapPool.push({
				code: code,
				fromTrans: id1,
				toTrans: id2
			});

			// Swap them in the $view.
			var trans1 = els.data.rows[idx1];
			els.data.rows[idx1] = els.data.rows[idx2];
			els.data.rows[idx2] = trans1;
			els.loadCurrentPage();

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
			addItem: addItem,
			modifyItem: modifyItem,
			deleteItem: deleteItem,
			swapExpense: swapExpense
		};
	}

})(window.angular);
