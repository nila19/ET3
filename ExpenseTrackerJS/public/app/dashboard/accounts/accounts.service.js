/** ** ./dashboard/accounts/accounts.service.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.accounts').factory('accountsService', accountsService);

  accountsService.$inject = ['etmenuService', 'dashboardService', 'billsService',
    'explistService', 'searchService', 'utilsService', 'ajaxService', 'CONSTANTS'];
  function accountsService(ms, ds, bs, els, ss, us, aj, C) {
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
      data.rows = [];
      for (let i = 0; i < data.maxRows; i++) {
        const row = {
          idx: i
        };

        row.cols = data.accts.slice(i * cols, (i + 1) * cols);
        data.rows.push(row);
      }
    };
    const loadData = function (dt) {
      ds.data.loading.donestep = 1;
      data.accts = dt;
      data.maxRows = Math.ceil(data.accts.length / cols);
      buildRows();
    };
    const loadAllAccounts = function () {
      const input = {
        city: ms.data.menu.city.id,
      };

      aj.query('/startup/accounts', input, loadData);
    };
    const loadAccount = function (dt) {
      data.accts[us.getIndexOf(data.accts, dt.id)] = dt;
      buildRows();
      ms.data.loading = false;
    };
    const refreshAccount = function (id) {
      ms.data.loading = true;
      aj.get('/dashboard/account/' + id, {}, loadAccount);
    };
    const loadTally = function () {
      ms.data.loading = false;
      us.showMsg('Tally', 'success');
      refreshAccount(data.tallyOn);
      ss.doSearch();
    };
    const tallyAccount = function (id) {
      ms.data.loading = true;
      data.tallyOn = id;
      aj.post('/entry/tally/' + ms.data.menu.city.id + '/' + id, {}, loadTally);
    };
    const filterAccount = function (id) {
      data.filterBy = id;
      bs.clearBillsList();
      bs.loadBillsForAcct(id);
      ss.data.account = {
        id: id
      };
      ss.data.bill = null;
			// search will be triggered from ctrl.
    };

    return {
      data: data,
      loadAllAccounts: loadAllAccounts,
      tallyAccount: tallyAccount,
      filterAccount: filterAccount,
      refreshAccount: refreshAccount
    };
  }
})(window.angular);