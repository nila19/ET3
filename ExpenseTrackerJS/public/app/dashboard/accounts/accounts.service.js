/** ** ./dashboard/accounts/accounts.service.js *** */

(function (angular) {
  'use strict';

  const accountsService = function (ms, ds, bs, els, ss, us, aj, C) {
    const data = {
      accts: null,
      rows: [],
      maxRows: 0,
      showAcctsRowOne: false,
      showAcctsMore: false,
      filterBy: null,
      tallyOn: null
    };
    const cols = C.SIZES.ACCTS_COL;

    const buildRows = function () {
      const i = {i: 0};

      data.rows = [];
      for (i.i = 0; i.i < data.maxRows; i.i++) {
        const row = {idx: i.i};

        row.cols = data.accts.slice(i.i * cols, (i.i + 1) * cols);
        data.rows.push(row);
      }
    };
    const loadData = function (dt) {
      ds.data.loading.donestep = 1;
      data.accts = dt.data;
      data.maxRows = Math.ceil(data.accts.length / cols);
      buildRows();
    };
    const loadAllAccounts = function () {
      const input = {cityId: ms.data.menu.city.id};

      aj.query('/startup/accounts', input, loadData);
    };
    const loadAccount = function (dt) {
      data.accts[us.getIndexOf(data.accts, dt.data.id)] = dt.data;
      buildRows();
      ms.data.loading = false;
    };
    const loadTally = function (dt) {
      ms.data.loading = false;
      us.showMsg('Tally', dt.code);
      if (dt.code === 0) {
        ss.doSearch();
      }
    };
    const tallyAccount = function (id) {
      ms.data.loading = true;
      data.tallyOn = id;
      aj.post('/edit/tally/' + id, {}, loadTally);
    };
    const filterAccount = function (id) {
      data.filterBy = id;
      bs.clearBillsList();
      bs.loadBills(id);
      ss.data.account = {
        id: id
      };
      ss.data.bill = null;
      // search will be triggered from ctrl.
    };

    return {
      data: data,
      loadAllAccounts: loadAllAccounts,
      loadAccount: loadAccount,
      tallyAccount: tallyAccount,
      filterAccount: filterAccount
    };
  };

  angular.module('dashboard.accounts').factory('accountsService', accountsService);
  accountsService.$inject = ['etmenuService', 'dashboardService', 'billsService', 'explistService', 'searchService',
    'utilsService', 'ajaxService', 'CONSTANTS'
  ];
})(window.angular);
