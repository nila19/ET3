/** ** ./dashboard/bills/bills.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.bills').factory('billsService', billsService);

	billsService.$inject = ['etmenuService', 'ajaxService', 'CONSTANTS'];
	function billsService(ms, aj, C) {
		var data = {
			showBills: false,
			rows: [],
			pgData: {},
			currPageNo: 0,
			maxPageNo: 0,
			filterApplied: false,
			filterBy: null,
			loading: false
		};
		var rows = C.SIZES.BILLS_ROW;

		var getIndexOf = function(id) {
			var idx;
			data.rows.forEach(function(row, i) {
				if (row.id === id) {
					idx = i;
				}
			});
			return idx;
		};
		var loadDataForPage = function() {
			var pg = data.currPageNo;
			data.pgData.rows = data.rows.slice(pg * rows, (pg + 1) * rows);
		};
		var loadBill = function(dt) {
			var idx = getIndexOf(dt.id);
			data.rows[idx] = dt;
			loadDataForPage();
			data.loading = false;
		};
		var refreshBill = function(id) {
			data.loading = true;
			aj.get('/entry/bill/' + id, {}, loadBill);
		};
		var loadData = function(dt) {
			data.rows = dt;
			data.maxPageNo = Math.ceil(data.rows.length / rows) - 1;
			data.currPageNo = 0;
			loadDataForPage();
			data.loading = false;
		};
		var loadBillsForAcct = function(id) {
			data.loading = true;
			aj.query('/entry/bills/' + id, {}, loadData);
		};
		var loadAllBills = function() {
			data.loading = true;
			var input = {
				city: ms.data.menu.city.id,
			};
			aj.query('/startup/bills', input, loadData);
		};
		return {
			data: data,
			getIndexOf: getIndexOf,
			loadData: loadData,
			loadDataForPage: loadDataForPage,
			loadBillsForAcct: loadBillsForAcct,
			loadAllBills: loadAllBills,
			refreshBill: refreshBill
		};
	}

})(window.angular);
