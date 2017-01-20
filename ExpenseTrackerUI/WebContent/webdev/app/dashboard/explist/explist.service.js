/** ** ./dashboard/explist/explist.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').factory('explistService', explistService);

	explistService.$inject = ['etmenuService', 'accountsService', 'billsService', 'ajaxService',
			'CONSTANTS', '$timeout'];
	function explistService(ms, acs, bs, aj, C, $timeout) {
		var data = {
			pgData: {
				rows: []
			},
			maxPageNo: 0,
			currPageNo: 0,
			rowCount: 1,
			loading: false,
			filterApplied: false,
			total: 0,
			rows: []
		};

		var dummyExpenses = function() {
			return [{
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
			}];
		};

		var calTotal = function() {
			var tot = 0;
			data.rows.forEach(function(row) {
				tot += row.amount;
			});
			data.total = tot;
		};
		var loadData = function(data) {
			this.data.rows = data;

			this.data.maxPageNo = Math.ceil(this.data.rows.length / this.data.rowCount) - 1;
			this.data.currPageNo = 0;
			this.loadDataForPage();
			calTotal();
			this.data.loading = false;
		};
		var loadDataForPage = function() {
			var pg = data.currPageNo;
			data.pgData.rows = data.rows.slice(pg * data.rowCount, (pg + 1) * data.rowCount);
		};
		var getIndexOf = function(transId) {
			var idx;
			this.data.rows.forEach(function(row, i) {
				if (row.transId === transId) {
					idx = i;
				}
			});
			return idx;
		};
		var swapPool = [];
		var tempPool = [];
		var publishing = false;
		var looperOn = false;
		var swapExpense = function(idx1, idx2) {
			var transId1 = data.rows[idx1].transId;
			var transId2 = data.rows[idx2].transId;

			var code = transId1 * 10 + transId2; // Unique code to identify.
			swapPool.push({
				code: code,
				fromTrans: transId1,
				toTrans: transId2
			});

			// Swap them in the $view.
			var trans1 = data.rows[idx1];
			data.rows[idx1] = data.rows[idx2];
			data.rows[idx2] = trans1;
			loadDataForPage();

			if (!looperOn) {
				looperOn = true;
				$timeout(function() {
					looper();
				}, 3000);
			}
		};
		var looper = function() {
			if (swapPool.length > 0) {
				if (!publishing) {
					publishing = true;
					publishSwap();
				}
				$timeout(function() {
					looper();
				}, 3000);
			} else {
				looperOn = false;
			}
		};
		var publishSwap = function() {
			tempPool = [];
			angular.forEach(swapPool, function(swap) {
				tempPool.push(swap);
			});

			console.log('Publishing swaps...' + tempPool.length);
			data.loading = true;
			aj.post('/entry/swap', tempPool, loadResults);
		};
		var loadResults = function() {
			angular.forEach(tempPool, function(temp) {
				var idx = -1;
				for (var i = 0; i < swapPool.length; i++) {
					if (temp.code === swapPool[i].code) {
						idx = i;
						break;
					}
				}
				if (idx > -1) {
					swapPool.splice(idx, 1);
				}
			});
			publishing = false;
			data.loading = false;
		};

		return {
			data: data,
			dummyExpenses: dummyExpenses,
			loadData: loadData,
			loadDataForPage: loadDataForPage,
			getIndexOf: getIndexOf,
			swapExpense: swapExpense
		};
	}

})(window.angular);
