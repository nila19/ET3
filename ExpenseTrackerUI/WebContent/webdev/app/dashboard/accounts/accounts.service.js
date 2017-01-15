/** ** ./dashboard/accounts/accounts.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.accounts').factory('accountsService', accountsService);

	accountsService.$inject = ['etmenuService', 'utilsService', 'CONSTANTS'];
	function accountsService(ms, us, C) {
		var data = {
			rows: [],
			maxRows: 0,
			showAcctsRowOne: false,
			showAcctsMore: false,
			filterBy: null
		};
		var colCount = C.SIZES.ACCTS_COL;

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
					id: 309,
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

		var loadAccountDetails = function() {
			// TODO Ajax fetch account details from DB.
			console.log('Getting account details @ vDB..' + JSON.stringify(ms.data.city));
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
			console.log('Tallying account @ vDB :: ' + id + ', ' + ms.data.city.name);
			us.showMsg('Tally', 'success');
		};

		return {
			data: data,
			loadAccountDetails: loadAccountDetails,
			loadData: loadData,
			tallyAccount: tallyAccount
		};
	}

})(window.angular);
