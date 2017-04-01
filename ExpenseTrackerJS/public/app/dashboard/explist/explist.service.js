/** ** ./dashboard/explist/explist.service.js *** */

(function (angular) {
  'use strict';

  const explistService = function (us, C) {
    const data = {
      pgData: {
        rows: []
      },
      maxPageNo: 0,
      currPageSet: 0,
      currPageNo: 0,
      rowCount: 1,
      pageSetSize: C.SIZES.PAGINATE_BTN,
      loading: false,
      filterApplied: false,
      thinList: true,
      thinListToggle: false,
      total: 0,
      rows: []
    };

    const calTotal = function () {
      data.total = 0;
      data.rows.forEach(function (row) {
        data.total += row.amount;
      });
    };
    const loadCurrentPage = function () {
      const pg = data.currPageNo;

      data.pgData.rows = data.rows.slice(pg * data.rowCount, (pg + 1) * data.rowCount);
    };
    const paginate = function () {
      data.maxPageNo = Math.ceil(data.rows.length / data.rowCount) - 1;
      calTotal();
      loadCurrentPage();
    };
    const loadData = function (dt) {
      data.rows = dt;
      data.currPageSet = 0;
      data.currPageNo = 0;
      data.loading = false;

      paginate();
    };
    const addItem = function (item) {
      data.rows.unshift(item);
      paginate();
    };
    const modifyItem = function (item) {
      const idx = us.getIndexOf(data.rows, item.id);

      data.rows[idx] = item;
      paginate();
    };
    const deleteItem = function (id) {
      data.rows.splice(us.getIndexOf(data.rows, id), 1);
      paginate();
    };

    return {
      data: data,
      loadData: loadData,
      paginate: paginate,
      loadCurrentPage: loadCurrentPage,
      addItem: addItem,
      modifyItem: modifyItem,
      deleteItem: deleteItem
    };
  };

  angular.module('dashboard.explist').factory('explistService', explistService);
  explistService.$inject = ['utilsService', 'CONSTANTS'];
})(window.angular);
