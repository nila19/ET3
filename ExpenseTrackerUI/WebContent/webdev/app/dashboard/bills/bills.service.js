/** ** ./dashboard/bills/bills.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.bills').factory('billsService', billsService);

	billsService.$inject = ['etmenuService', 'dashboardService', 'ajaxService', 'utilsService',
			'CONSTANTS'];
	function billsService(ms, ds, aj, us, C) {
		var data = {
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
		var rows = C.SIZES.BILLS_ROW;

		var clearBillsList = function() {
			data.openBills = null;
			data.closedBills = null;
			data.tab = 'OPEN';
		};
		var loadCurrentPage = function() {
			var pg = data.currPageNo;
			data.pgData.rows = data.rows.slice(pg * rows, (pg + 1) * rows);
		};
		var loadBill = function(dt) {
			var idx = us.getIndexOf(data.rows, dt.id);
			data.rows[idx] = dt;
			loadCurrentPage();
			data.loading = false;
		};
		var refreshBill = function(id) {
			data.loading = true;
			aj.get('/entry/bill/' + id, {}, loadBill);
		};
		var buildRowsForTab = function() {
			data.rows = data.tab === 'OPEN' ? data.openBills : data.closedBills;
			data.maxPageNo = Math.ceil(data.rows.length / rows) - 1;
			data.currPageSet = 0;
			data.currPageNo = 0;
			loadCurrentPage();
			data.loading = false;
		};
		var loadData = function(dt) {
			ds.data.loading.donestep = 2;
			if (data.tab === 'OPEN') {
				data.openBills = dt;
			} else {
				data.closedBills = dt;
			}
			buildRowsForTab();
		};
		var loadBillsForAcct = function(id) {
			data.loading = true;
			data.filterApplied = true;
			var input = {
				city: ms.data.menu.city.id,
				acctId: id,
				open: data.tab === 'OPEN'
			};
			aj.query('/entry/bills', input, loadData);
		};
		var loadAllBills = function() {
			data.loading = true;
			data.filterApplied = false;
			var input = {
				city: ms.data.menu.city.id,
				acctId: 0,
				open: data.tab === 'OPEN'
			};
			aj.query('/entry/bills', input, loadData);
		};
		return {
			data: data,
			clearBillsList: clearBillsList,
			loadData: loadData,
			buildRowsForTab: buildRowsForTab,
			loadCurrentPage: loadCurrentPage,
			loadBillsForAcct: loadBillsForAcct,
			loadAllBills: loadAllBills,
			refreshBill: refreshBill
		};
	}

})(window.angular);
