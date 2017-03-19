/** ** ./dashboard/explist/explistwrapper.service.js *** */

(function (angular) {
  'use strict';

  const explistwrapperService = function (els, ms, ss, acs, bs, aj, us, C, $timeout) {
    const DELAY = 1000; // milliseconds
    const TEN = 10;

    const reloadExpenses = function () {
      ss.data.thinList = els.data.thinList;
      ss.doSearch();
    };
    const clearFilter = function () {
      ss.initializeData();
      if (ms.data.page === C.PAGES.DASHBOARD) {
				// clear filter for Bills
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
    const loadAddItem = function (dt) {
      els.addItem(dt.data);
    };
    const addItem = function (id) {
      aj.get('/dashboard/transaction/' + id, {}, loadAddItem);
    };
    const loadModifyItem = function (dt) {
      els.modifyItem(dt.data);
    };
    const modifyItem = function (id) {
      aj.get('/dashboard/transaction/' + id, {}, loadModifyItem);
    };
    const deleteItem = function (id) {
      els.deleteItem(id);
    };

		// swap Expenses.
    const swapPool = [];
    let tempPool = [];
    let publishing = false;
    let looperOn = false;
    const resetSwapPool = function () {
      angular.forEach(tempPool, function (temp) {
        let idx = -1;

        for (let i = 0; i < swapPool.length; i++) {
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
    const publishSwap = function () {
      tempPool = [];
      angular.forEach(swapPool, function (swap) {
        tempPool.push(swap);
      });

      // console.log('Publishing swaps...' + tempPool.length);
      els.data.loading = true;
      aj.post('/edit/swap/' + ms.data.menu.city.id, tempPool, resetSwapPool);
    };
    const looper = function () {
      if (swapPool.length > 0) {
        if (!publishing) {
          publishing = true;
          publishSwap();
        }
        $timeout(function () {
          looper();
        }, DELAY);
      } else {
        looperOn = false;
      }
    };
    const swapExpense = function (idx1, idx2) {
      const id1 = els.data.rows[idx1].id;
      const id2 = els.data.rows[idx2].id;
      const code = (id1 * TEN) + id2; // unique code to identify.

      swapPool.push({
        code: code,
        fromTrans: id1,
        toTrans: id2
      });

			// swap them in the $view.
      const trans1 = els.data.rows[idx1];

      els.data.rows[idx1] = els.data.rows[idx2];
      els.data.rows[idx2] = trans1;
      els.loadCurrentPage();

      if (!looperOn) {
        looperOn = true;
        $timeout(function () {
          looper();
        }, DELAY);
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
  };

  angular.module('dashboard.explist').factory('explistwrapperService', explistwrapperService);
  explistwrapperService.$inject = ['explistService', 'etmenuService', 'searchService', 'accountsService',
    'billsService', 'ajaxService', 'utilsService', 'CONSTANTS', '$timeout'];
})(window.angular);
