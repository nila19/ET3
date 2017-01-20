/** ** ./dashboard/bills/bills.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.bills').factory('billsService', billsService);

	billsService.$inject = ['etmenuService', 'accountsService', 'CONSTANTS'];
	function billsService(ms, acs, C) {
		var data = {
			showBills: false,
			pgData: {},
			currPageNo: 0,
			maxPageNo: 0,
			filterApplied: false,
			filterBy: null,
			rows: []
		};
		var rowCount = C.SIZES.BILLS_ROW;

		var dummyBills = function() {
			return {
				filterApplied: false,
				rows: [{
					id: 301,
					acct: {
						id: 60,
						name: 'BOA VISA'
					},
					name: '24-Dec-16 #0065',
					billDt: 1288323623006,
					billAmt: 1250.45,
					dueDt: 1298323623006,
					paid: false,
					paidDt: null
				}, {
					id: 302,
					acct: {
						id: 83,
						name: 'Chase Freedom'
					},
					name: '24-Dec-16 #0065',
					billDt: 1288323623006,
					billAmt: 150.45,
					dueDt: 1228323623006,
					paid: false,
					paidDt: null
				}, {
					id: 303,
					acct: {
						id: 60,
						name: 'BOA VISA'
					},
					name: '24-Dec-16 #0065',
					billDt: 1288323623006,
					billAmt: 250.45,
					dueDt: 1598323623006,
					paid: true,
					paidDt: 1298543623006
				}, {
					id: 304,
					acct: {
						id: 60,
						name: 'BOA VISA'
					},
					name: '24-Dec-16 #0065',
					billDt: 1288453623006,
					billAmt: 80,
					dueDt: 1198323623006,
					paid: true,
					paidDt: 1283423623006
				}, {
					id: 305,
					acct: {
						id: 83,
						name: 'Chase Freedom'
					},
					name: '24-Dec-16 #0065',
					billDt: 1267323623006,
					billAmt: 12785.89,
					dueDt: 1297823623006,
					paid: true,
					paidDt: 1284523623006
				}]
			};
		};

		var clearFilter = function() {
			console.log('Clearing filter on Bills....');
			this.data.filterApplied = false;
			acs.data.filterBy = null;
			this.loadAllBills();
		};
		var loadAllBills = function() {
			var list = null;
			if (acs.data.filterBy) {
				console.log('Filtering bills for Account @ vDB :: ' + acs.data.filterBy);
				// TODO Ajax query DB for all Bills for the account, sort by Open at top.
				list = dummyBills();
			} else {
				console.log('Getting all bills @ vDB...');
				// TODO Ajax query DB for all Bills, sort by Open at top & then by Account.
				list = dummyBills();
			}
			console.log('Loading Bills @ vDB... ' + ms.data.menu.city.name);
			this.loadData(list);
		};
		var loadData = function(data) {
			this.data.rows = data.rows;
			this.data.maxPageNo = Math.ceil(this.data.rows.length / rowCount) - 1;
			this.data.pgData.filterApplied = this.data.filterApplied;
			this.data.currPageNo = 0;
			this.loadDataForPage();
		};
		var loadDataForPage = function() {
			var pg = this.data.currPageNo;
			this.data.pgData.rows = this.data.rows.slice(pg * rowCount, (pg + 1) * rowCount);
		};
		return {
			data: data,
			clearFilter: clearFilter,
			loadAllBills: loadAllBills,
			loadData: loadData,
			loadDataForPage: loadDataForPage
		};
	}

})(window.angular);
