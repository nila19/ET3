/** ** ./summary/summary.service.js *** */

(function (angular) {
  'use strict';

  const summaryService = function (ms, aj) {
    const data = {
      months: [],
      totalrow: {},
      rows: [],
      pgData: {},
      maxPageNo: 0,
      currPageNo: 0,
      columns: 0,
      input: {
        cityId: 0,
        forecast: false,
        adhoc: true,
        regular: true
      }
    };

    const loadCurrentPage = function () {
      const pg = data.currPageNo;
      const cols = data.columns;

      data.pgData.months = data.months.slice(pg * cols, (pg + 1) * cols);
      data.pgData.totalrow = data.totalrow.amount.slice(pg * cols, (pg + 1) * cols);

      const pgRows = [];

      data.rows.forEach(function (row) {
        const pgRow = {};

        pgRow.category = row.category;
        pgRow.amount = row.amount.slice(pg * cols, (pg + 1) * cols);
        pgRow.count = row.count.slice(pg * cols, (pg + 1) * cols);
        pgRows.push(pgRow);
      });
      data.pgData.rows = pgRows;
    };
    const loadData = function (dt) {
      data.totalrow = dt.splice(0, 1)[0];
      data.rows = dt;
      data.maxPageNo = Math.ceil(data.months.length / data.columns) - 1;
      data.currPageNo = 0;
      loadCurrentPage();
      ms.data.loading = false;
    };
    const loadSummary = function () {
      ms.data.loading = true;
      data.input.cityId = ms.data.menu.city.id;
      aj.query('/summary/go', data.input, loadData);
    };

    return {
      data: data,
      loadSummary: loadSummary,
      loadCurrentPage: loadCurrentPage
    };
  };

  angular.module('summary').factory('summaryService', summaryService);
  summaryService.$inject = ['etmenuService', 'ajaxService'];
})(window.angular);
