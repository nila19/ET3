/** ** ./dashboard/accounts/accounts.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.accounts').factory('accountsService', accountsService);

	accountsService.$inject = ['etmenuService', 'billsService', 'explistService', 'searchService',
			'utilsService', 'ajaxService', 'CONSTANTS'];
	function accountsService(ms, bs, els, ss, us, aj, C) {
		var data = {
			accts: null,
			rows: [],
			maxRows: 0,
			showAcctsRowOne: false,
			showAcctsMore: false,
			filterBy: null,
			tallyOn: null
		};
		var cols = C.SIZES.ACCTS_COL;

		var buildRows = function() {
			data.rows = [];
			for (var i = 0; i < data.maxRows; i++) {
				var row = {
					idx: i
				};
				row.cols = data.accts.slice(i * cols, (i + 1) * cols);
				data.rows.push(row);
			}
		};
		var loadData = function(data) {
			this.data.accts = data;
			this.data.maxRows = Math.ceil(this.data.accts.length / cols);
			buildRows();
		};

		var loadAccount = function(dt) {
			data.accts[us.getIndexOf(data.accts, dt.id)] = dt;
			buildRows();
			ms.data.loading = false;
		};
		var refreshAccount = function(id) {
			ms.data.loading = true;
			aj.get('/startup/account/' + id, {}, loadAccount);
		};
		var loadTally = function() {
			ms.data.loading = false;
			us.showMsg('Tally', 'success');
			refreshAccount(data.tallyOn);
		};
		var tallyAccount = function(id) {
			ms.data.loading = true;
			this.data.tallyOn = id;
			aj.post('/entry/tally/' + id, {}, loadTally);
		};
		var filterAccount = function(id) {
			this.data.filterBy = id;

			bs.data.filterApplied = true;
			bs.loadBillsForAcct(id);

			ss.data.account = {
				id: id
			};
			ss.data.bill = null;
			// Search will be triggered from ctrl.
		};

		return {
			data: data,
			loadData: loadData,
			tallyAccount: tallyAccount,
			filterAccount: filterAccount,
			refreshAccount: refreshAccount
		};
	}

})(window.angular);
