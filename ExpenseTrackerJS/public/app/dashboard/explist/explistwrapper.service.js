/** ** ./dashboard/explist/explistwrapper.service.js *** */

import './explist.module';

(function (angular) {
  'use strict';

  const explistwrapperService = function (els, ms, ss, acs, bs, aj, us, C, $timeout) {
    const DELAY = 1000; // milliseconds
    const TEN = 10;
    const data = {
      swapPool: [],
      tempPool: [],
      publishing: false,
      looperOn: false
    };

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
    const resetSwapPool = function () {
      angular.forEach(data.tempPool, function (temp) {
        const i = {idx: -1, i: 0};

        for (i.i = 0; i.i < data.swapPool.length; i.i++) {
          if (temp.code === data.swapPool[i.i].code) {
            i.idx = i.i;
            break;
          }
        }
        if (i.idx > -1) {
          data.swapPool.splice(i.idx, 1);
        }
      });
      data.publishing = false;
      els.data.loading = false;
    };
    const publishSwap = function () {
      data.tempPool = [];
      angular.forEach(data.swapPool, function (swap) {
        data.tempPool.push(swap);
      });

      // console.log('Publishing swaps...' + tempPool.length);
      els.data.loading = true;
      aj.post('/edit/swap/' + ms.data.menu.city.id, data.tempPool, resetSwapPool);
    };
    const looper = function () {
      if (data.swapPool.length > 0) {
        if (!data.publishing) {
          data.publishing = true;
          publishSwap();
        }
        $timeout(function () {
          looper();
        }, DELAY);
      } else {
        data.looperOn = false;
      }
    };
    const swapExpense = function (idx1, idx2) {
      const id1 = els.data.rows[idx1].id;
      const id2 = els.data.rows[idx2].id;
      const code = (id1 * TEN) + id2; // unique code to identify.

      data.swapPool.push({
        code: code,
        fromTrans: id1,
        toTrans: id2
      });

			// swap them in the $view.
      const trans1 = els.data.rows[idx1];

      els.data.rows[idx1] = els.data.rows[idx2];
      els.data.rows[idx2] = trans1;
      els.loadCurrentPage();

      if (!data.looperOn) {
        data.looperOn = true;
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
