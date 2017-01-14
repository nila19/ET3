/** ** ./dashboard/bills/bills.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.bills').factory('billsService', billsService);

	billsService.$inject = ['CONSTANTS'];
	function billsService(C) {
		var data = {
			showBills: false,
			pgData: {},
			currPageNo: 0,
			maxPageNo: 0,
			filterApplied: false,
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
		var dummyExpenses = function() {
			return {
				filterApplied: true,
				total: 320.45,
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

		var loadAllBills = function() {
			console.log('Getting list of all Bills @ vDB... ');
			// TODO Ajax query DB for all Bills, sort by Open at top & then by Account.
			this.loadData(dummyBills());
		};
		var loadData = function(data) {
			this.data.filterApplied = data.filterApplied;
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
		var getExpenses = function(id) {
			console.log('Filtering expenses for Bill @ vDB :: ' + id);
			// TODO Ajax fetch expenses.
			return dummyExpenses();
		};
		return {
			data: data,
			loadAllBills: loadAllBills,
			loadData: loadData,
			loadDataForPage: loadDataForPage,
			getExpenses: getExpenses,
		};
	}

})(window.angular);
