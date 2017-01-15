/** ** ./dashboard/explist/explist.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').factory('explistService', explistService);

	explistService.$inject = ['etmenuService', 'searchService', 'accountsService', 'billsService',
			'CONSTANTS'];
	function explistService(ms, ss, acs, bs, C) {
		var data = {
			pgData: {
				rows: []
			},
			maxPageNo: 0,
			currPageNo: 0,
			rowCount: 1,
			filterApplied: false,
			total: 0,
			rows: []
		};

		var dummyExpenses = function() {
			return {
				total: 1500.45,
				rows: [{
					id: 2560,
					seq: 2200,
					entryDt: 1288323623006,
					transDt: 1288323663006,
					cat: 'Transport ~ Car Gas',
					desc: 'Costco Gas',
					amt: 34.50,
					fromAc: 'BOA - 7787',
					fromFrom: 8944.60,
					fromTo: 8910.10,
					toAc: 'BOA VISA',
					toFrom: 1240.55,
					toTo: 1206.05,
					adhoc: true,
					adjust: false
				}, {
					id: 2460,
					seq: 2190,
					entryDt: 1289523623006,
					transDt: 1288323663006,
					cat: 'Food ~ Kroger Groceries',
					desc: 'Taekwondo Belt Testing',
					amt: 88.00,
					fromAc: 'BOA - 7787',
					fromFrom: 8934.60,
					fromTo: 8920.10,
					toAc: 'GAP VISA',
					toFrom: 740.55,
					toTo: 1106.05,
					adhoc: false,
					adjust: false
				}, {
					id: 2360,
					seq: 2180,
					entryDt: 1288323663006,
					transDt: 1288323663006,
					cat: 'Food ~ Kroger Groceries',
					desc: 'Kroger',
					amt: 25.88,
					fromAc: 'BOA VISA',
					fromFrom: 8844.60,
					fromTo: 8710.10,
					toAc: '--',
					toFrom: 0,
					toTo: 0,
					adhoc: true,
					adjust: false
				}, {
					id: 2260,
					seq: 2170,
					entryDt: 1288323663006,
					transDt: 1288323663006,
					cat: '--',
					desc: 'Credit card bill payment',
					amt: 25.88,
					fromAc: 'BOA 7787',
					fromFrom: 8844.60,
					fromTo: 8710.10,
					toAc: 'BOA VISA',
					toFrom: 2300.44,
					toTo: 300.44,
					adhoc: false,
					adjust: true
				}, {
					id: 2160,
					seq: 2160,
					entryDt: 1288323663006,
					transDt: 1288323663006,
					cat: 'Food ~ Kroger Groceries',
					desc: 'Kroger',
					amt: 25.88,
					fromAc: 'BOA VISA',
					fromFrom: 8844.60,
					fromTo: 8710.10,
					toAc: '--',
					toFrom: 0,
					toTo: 0,
					adhoc: true,
					adjust: false
				}, {
					id: 2060,
					seq: 2190,
					entryDt: 1288323663006,
					transDt: 1288323663006,
					cat: 'Food ~ Kroger Groceries',
					desc: 'Taekwondo Belt Testing',
					amt: 88.00,
					fromAc: 'BOA - 7787',
					fromFrom: 8934.60,
					fromTo: 8920.10,
					toAc: 'GAP VISA',
					toFrom: 740.55,
					toTo: 1106.05,
					adhoc: false,
					adjust: false
				}, {
					id: 2000,
					seq: 2200,
					entryDt: 1288323663006,
					transDt: 1288323663006,
					cat: 'Transport ~ Car Gas',
					desc: '	Costco Gas',
					amt: 34.50,
					fromAc: 'BOA - 7787',
					fromFrom: 8944.60,
					fromTo: 8910.10,
					toAc: 'BOA VISA',
					toFrom: 1240.55,
					toTo: 1206.05,
					adhoc: true,
					adjust: false
				}]
			};
		};

		var clearFilter = function() {
			console.log('Clearing filter on Expenses....');
			this.data.filterApplied = false;
			if (ms.data.page === C.PAGES.SEARCH) {
				ss.initializeData();
			} else if (ms.data.page === C.PAGES.DASHBOARD) {
				// Clear filter for Bills
				if (acs.data.filterBy) {
					bs.clearFilter();
				}
				bs.data.filterBy = null;
				acs.data.filterBy = null;
			}
			this.loadAllExpenses();
		};
		var loadAllExpenses = function() {
			var list = null;
			if (ms.data.page === C.PAGES.SEARCH) {
				list = ss.doSearch();
			} else if (ms.data.page === C.PAGES.DASHBOARD) {
				if (bs.data.filterBy) {
					console.log('Filtering expenses for Bill @ vDB :: ' + bs.data.filterBy);
					// Filter by Bill
					// TODO Ajax fetch all expenses.
					list = dummyExpenses();
				} else if (acs.data.filterBy) {
					console.log('Filtering expenses for Account @ vDB :: ' + acs.data.filterBy);
					// Filter by Account
					// TODO Ajax fetch all expenses.
					list = dummyExpenses();
				} else {
					console.log('Getting all expenses @ vDB');
					// TODO Ajax fetch all expenses.
					list = dummyExpenses();
				}
			}
			console.log('Loading Expenses @ vDB...' + ms.data.city.name);
			this.loadData(list);
		};
		var loadData = function(data) {
			this.data.total = data.total;
			this.data.rows = data.rows;

			this.data.maxPageNo = Math.ceil(this.data.rows.length / this.data.rowCount) - 1;
			this.data.currPageNo = 0;
			this.loadDataForPage();
		};
		var loadDataForPage = function() {
			var pg = this.data.currPageNo;
			this.data.pgData.rows = this.data.rows.slice(pg * this.data.rowCount, (pg + 1) *
					this.data.rowCount);
		};
		var getIndexOf = function(id) {
			var idx;
			this.data.rows.forEach(function(row, i) {
				if (row.id === id) {
					idx = i;
				}
			});
			return idx;
		};

		return {
			data: data,
			clearFilter: clearFilter,
			loadAllExpenses: loadAllExpenses,
			loadData: loadData,
			loadDataForPage: loadDataForPage,
			getIndexOf: getIndexOf
		};
	}

})(window.angular);
