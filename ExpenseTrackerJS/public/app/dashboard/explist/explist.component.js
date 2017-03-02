/** ** ./dashboard/explist/explist.component.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.explist').component('explist', {
    templateUrl: 'dashboard/explist/explist.htm',
    controller: ExplistController
  });

  ExplistController.$inject = ['explistwrapperService', 'explistService', 'editService', 'utilsService'];
  const ExplistController = function (elws, els, es, us) {
    const vm = this;

    init();

		// ***** exposed functions ******//
    vm.hasPrevPageSet = hasPrevPageSet;
    vm.hasNextPageSet = hasNextPageSet;
    vm.prevPageSet = prevPageSet;
    vm.nextPageSet = nextPageSet;
    vm.page = page;
    vm.loadPage = loadPage;
    vm.showModifyExpense = showModifyExpense;
    vm.showDeleteExpense = showDeleteExpense;
    vm.swapExpense = swapExpense;
    vm.clearFilter = clearFilter;
    vm.toggleThinList = toggleThinList;

		// ***** function declarations *****//
    const init = function () {
      vm.data = els.data;
    };
    const hasPrevPageSet = function () {
      return els.data.currPageSet > 0;
    };
    const hasNextPageSet = function () {
      return ((els.data.currPageSet + 1) * els.data.pageSetSize) <= els.data.maxPageNo;
    };
    const prevPageSet = function () {
      els.data.currPageSet -= 1;
    };
    const nextPageSet = function () {
      els.data.currPageSet += 1;
    };
		// idx will be 0,1,2,3,4
    const page = function (idx) {
      return (els.data.currPageSet * els.data.pageSetSize) + idx;
    };
    const loadPage = function (pg) {
      els.data.currPageNo = pg;
      els.loadCurrentPage();
    };
    const showModifyExpense = function (id) {
      editExpense(id);
      $('#model_Modify').modal('show');
    };
    const showDeleteExpense = function (id) {
      editExpense(id);
      $('#model_Delete').modal('show');
    };
    const editExpense = function (id) {
			// no need to fetch from DB. Fetch from local, clone & show in popup.
      const trans = $.extend({}, us.getObjectOf(els.data.rows, id));

      es.loadData(trans);
    };
    const swapExpense = function (id, diff) {
      const idx = us.getIndexOf(els.data.rows, id);

      elws.swapExpense(idx, idx + diff);
    };
    const clearFilter = function () {
      elws.clearFilter();
    };
    const toggleThinList = function () {
      if (els.data.thinListToggle) {
        els.data.thinList = !els.data.thinList;
        elws.reloadExpenses();
      }
    };
  };
})(window.angular);
