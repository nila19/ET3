/** ** ./dashboard/accounts/accounts.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.accounts').factory('accountsService', accountsService);

	accountsService.$inject = ['CONSTANTS'];
	function accountsService(C) {
		var data = {
			rows: [],
			maxRows: 0,
			showAcctsRowOne: false,
			showAcctsMore: false
		};
		var colCount = C.SIZES.ACCTS_COL;

		// /Dummy data
		var dummyAccounts = function() {
			return {
				accts: [{
					id: 301,
					name: 'BOA - 7787',
					icon: 'account_balance',
					bgColor: 'blue',
					balance: 11250.45,
					tallyAmt: 9660.80,
					tallyDt: 1298323623006,
					tallyToday: false,
					untallyCnt: 12,
					doBills: false,
					billDue: false,
					billAmt: 0,
					billDueDt: 0,
					nextBillDt: 0
				}, {
					id: 302,
					name: 'Chase Checking',
					icon: 'account_balance',
					bgColor: 'blue',
					balance: 2250.45,
					tallyAmt: 1660.80,
					tallyDt: 1265323623006,
					tallyToday: true,
					untallyCnt: 0,
					doBills: false,
					billDue: false,
					billAmt: 0,
					billDueDt: 0,
					nextBillDt: 0
				}, {
					id: 303,
					name: 'BOA VISA',
					icon: 'credit_card',
					bgColor: 'red',
					balance: 2250.45,
					tallyAmt: 1660.80,
					tallyDt: 1298323623006,
					tallyToday: false,
					untallyCnt: 12,
					doBills: true,
					billDue: true,
					billAmt: 2312.76,
					billDueDt: 1298323623006,
					nextBillDt: 1298323623006
				}, {
					id: 304,
					name: 'Chase Freedom',
					icon: 'credit_card',
					bgColor: 'red',
					balance: 250.45,
					tallyAmt: 60.80,
					tallyDt: 1298323623006,
					tallyToday: true,
					untallyCnt: 3,
					doBills: true,
					billDue: true,
					billAmt: 12.76,
					billDueDt: 1298323623006,
					nextBillDt: 1298323623006
				}, {
					id: 305,
					name: 'Blue Cash',
					icon: 'credit_card',
					bgColor: 'red',
					balance: 50.45,
					tallyAmt: 50.45,
					tallyDt: 1298323623006,
					tallyToday: false,
					untallyCnt: 0,
					doBills: true,
					billDue: false,
					billAmt: 0,
					billDueDt: 1298323623006,
					nextBillDt: 1298323623006
				}, {
					id: 306,
					name: 'GAP VISA',
					icon: 'credit_card',
					bgColor: 'red',
					balance: 100.45,
					tallyAmt: 90.45,
					tallyDt: 1298323623006,
					tallyToday: false,
					untallyCnt: 1,
					doBills: true,
					billDue: true,
					billAmt: 45,
					billDueDt: 1298323623006,
					nextBillDt: 1298323623006
				}, {
					id: 307,
					name: 'Cash - Bala',
					icon: 'attach_money',
					bgColor: 'green',
					balance: 500.45,
					tallyAmt: 500.45,
					tallyDt: 1298323623006,
					tallyToday: false,
					untallyCnt: 0,
					doBills: false,
					billDue: false,
					billAmt: 0,
					billDueDt: 0,
					nextBillDt: 0
				}, {
					id: 308,
					name: 'Cash - Anitha',
					icon: 'attach_money',
					bgColor: 'green',
					balance: 250.45,
					tallyAmt: 240.45,
					tallyDt: 1298323623006,
					tallyToday: false,
					untallyCnt: 1,
					doBills: false,
					billDue: false,
					billAmt: 0,
					billDueDt: 0,
					nextBillDt: 0
				}, {
					id: 303,
					name: 'HSA',
					icon: 'attach_money',
					bgColor: 'green',
					balance: 1750.45,
					tallyAmt: 1750.45,
					tallyDt: 1298323623006,
					tallyToday: false,
					untallyCnt: 0,
					doBills: false,
					billDue: false,
					billAmt: 0,
					billDueDt: 0,
					nextBillDt: 0
				}]
			};
		};
		var dummyBills = function() {
			return {
				filterApplied: true,
				rows: [{
					id: 301,
					acct: {
						id: 60,
						name: 'Chase Freedom'
					},
					name: '24-Dec-16 #0065',
					billDt: 1328523623006,
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
					name: '24-Nov-16 #0064',
					billDt: 1266328923006,
					billAmt: 150.45,
					dueDt: 1221632893006,
					paid: true,
					paidDt: 1231632893006
				}, {
					id: 305,
					acct: {
						id: 83,
						name: 'Chase Freedom'
					},
					name: '24-Oct-16 #0063',
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

		var loadAccountDetails = function() {
			// TODO Ajax fetch account details from DB.
			console.log('Getting account details @ vDB..');
			this.loadData(dummyAccounts());
		};
		var loadData = function(data) {
			this.data.accts = data.accts;
			this.data.maxRows = Math.ceil(this.data.accts.length / colCount);

			this.data.rows = [];
			for (var i = 0; i < this.data.maxRows; i++) {
				var row = {
					idx: i
				};
				row.cols = this.data.accts.slice(i * colCount, (i + 1) * colCount);
				this.data.rows.push(row);
			}
		};
		var tallyAccount = function(id) {
			// TODO - Ajax Tally id.
			console.log('Tallying the account @ vDB :: ' + id);
		};
		var getBills = function(id) {
			// TODO Ajax fetch bills for Account.
			console.log('Filtering bills for account @ vDB :: ' + id);
			return dummyBills();
		};
		var getExpenses = function(id) {
			console.log('Filtering expenses for Account @ vDB :: ' + id);
			// TODO Ajax fetch expenses for Account.
			return dummyExpenses();
		};

		return {
			data: data,
			loadAccountDetails: loadAccountDetails,
			loadData: loadData,
			tallyAccount: tallyAccount,
			getBills: getBills,
			getExpenses: getExpenses
		};
	}

})(window.angular);
