/** ** ./dashboard/bills/bills.component.js *** */

(function (angular) {
  'use strict';

  const BillsController = function (bws, bs, acs, elws, els, ss) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = bs.data;
    };
    const hasPrevPageSet = function () {
      return bs.data.currPageSet > 0;
    };
    const hasNextPageSet= function () {
      return ((bs.data.currPageSet + 1) * bs.data.pageSetSize) <= bs.data.maxPageNo;
    };
    const prevPageSet = function () {
      bs.data.currPageSet -= 1;
    };
    const nextPageSet= function () {
      bs.data.currPageSet += 1;
    };
		// idx will be 0,1,2,3,4
    const page = function (idx) {
      return (bs.data.currPageSet * bs.data.pageSetSize) + idx;
    };
    const loadPage= function (pg) {
      bs.data.currPageNo = pg;
      bs.loadCurrentPage();
    };
    const showBillPay = function (id) {
      bws.showBillPay(id);
      $('#model_BillPay').modal('show');
    };
    const filterExpenses = function (id) {
			// if same bill is already selected, do nothing.
      if (bs.data.filterBy !== id) {
        bs.data.filterBy = id;
        ss.data.bill = {
          id: id
        };
        elws.reloadExpenses();
      }
    };
    const clearFilter= function () {
      elws.clearFilter();
    };
    const showOpenBills = function () {
      bs.data.tab = 'OPEN';
      bs.buildRowsForTab();
    };
    const showClosedBills = function () {
      bs.data.tab = 'CLOSED';
      if (bs.data.closedBills == null) {
        if (acs.data.filterBy == null) {
          bs.loadAllBills();
        } else {
          bs.loadBillsForAcct(acs.data.filterBy);
        }
      } else {
        bs.buildRowsForTab();
      }
    };

    // ***** exposed functions ******//
    vm.hasPrevPageSet = hasPrevPageSet;
    vm.hasNextPageSet = hasNextPageSet;
    vm.prevPageSet = prevPageSet;
    vm.nextPageSet = nextPageSet;
    vm.page = page;
    vm.loadPage = loadPage;
    vm.showBillPay = showBillPay;
    vm.filterExpenses = filterExpenses;
    vm.clearFilter = clearFilter;
    vm.showOpenBills = showOpenBills;
    vm.showClosedBills = showClosedBills;

    init();
  };

  angular.module('dashboard.bills').component('bills', {
    templateUrl: 'dashboard/bills/bills.htm',
    controller: BillsController
  });
  BillsController.$inject = ['billswrapperService', 'billsService', 'accountsService', 'explistwrapperService',
    'explistService', 'searchService'];
})(window.angular);
