/** ** ./dashboard/bills/bills.service.js *** */

(function (angular) {
  'use strict';

  const billsService = function (ms, ds, aj, us, C) {
    const data = {
      showBills: false,
      rows: [],
      pgData: {},
      currPageSet: 0,
      currPageNo: 0,
      maxPageNo: 0,
      pageSetSize: C.SIZES.PAGINATE_BTN,
      tab: 'OPEN',
      openBills: [],
      closedBills: null,
      filterApplied: false,
      filterBy: null,
      loading: false
    };
    const rows = C.SIZES.BILLS_ROW;

    const clearBillsList = function () {
      data.openBills = null;
      data.closedBills = null;
      data.tab = 'OPEN';
    };
    const loadCurrentPage = function () {
      const pg = data.currPageNo;

      data.pgData.rows = data.rows.slice(pg * rows, (pg + 1) * rows);
    };
    const buildRowsForTab = function () {
      data.rows = data.tab === 'OPEN' ? data.openBills : data.closedBills;
      data.maxPageNo = Math.ceil(data.rows.length / rows) - 1;
      data.currPageSet = 0;
      data.currPageNo = 0;
      loadCurrentPage();
      data.loading = false;
    };
    const loadBill = function (dt) {
      const idx = us.getIndexOf(data.rows, dt.data.id);

      data.rows[idx] = dt.data;
      loadCurrentPage();
      data.loading = false;
    };
    const loadData = function (dt) {
      ds.data.loading.donestep = 2;
      if (data.tab === 'OPEN') {
        data.openBills = dt.data;
      } else {
        data.closedBills = dt.data;
      }
      buildRowsForTab();
    };
    const loadBills = function (id) {
      const input = {
        cityId: ms.data.menu.city.id,
        paidInd: (data.tab === 'OPEN') ? 'N' : 'Y'
      };

      if (id) {
        input.acctId = id;
      }
      data.loading = true;
      data.filterApplied = id ? true : false;

      aj.query('/dashboard/bills', input, loadData);
    };

    return {
      data: data,
      clearBillsList: clearBillsList,
      loadCurrentPage: loadCurrentPage,
      buildRowsForTab: buildRowsForTab,
      loadBill: loadBill,
      loadBills: loadBills
    };
  };

  angular.module('dashboard.bills').factory('billsService', billsService);
  billsService.$inject = ['etmenuService', 'dashboardService', 'ajaxService', 'utilsService', 'CONSTANTS'];
})(window.angular);
