/** ** ./dashboard/edit/edit.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.edit').factory('editService', editService);

	editService.$inject = ['etmenuService', 'utilsService'];
	function editService(ms, us) {
		var data = {
			expense: {}
		};

		var dummyExpense = function() {
			return {
				expense: {
					id: 2500,
					entryDt: 1288323623006,
					transDt: 1288323623006,
					category: {
						id: 1750,
						name: 'Food ~ Kroger Groceries',
						main: 'Food',
						sub: 'Kroger Groceries',
						icon: 'local_mall'
					},
					description: 'Costco Gas',
					amount: 34.50,
					fromAcc: {
						id: 620,
						name: 'BOA - 7787',
						doBills: true
					},
					fromFrom: 8944.60,
					fromTo: 8910.10,
					toAcc: {
						id: 600,
						name: 'BOA VISA',
						doBills: false
					},
					toFrom: 1240.55,
					toTo: 1206.05,
					adhoc: true,
					adjust: false,
					bill: {
						id: 21,
						name: 'BOA - 7787 - Bill #2'
					}
				}
			};
		};

		var dummyBills = function() {
			return [{
				id: 20,
				name: 'BOA - 7787 - Bill #1'
			}, {
				id: 21,
				name: 'BOA - 7787 - Bill #2'
			}, {
				id: 22,
				name: 'BOA - 7787 - Bill #3'
			}];
		};
		var loadExpense = function(id) {
			// TODO Ajax to fetch
			console.log('Fetching Exp data from @ vDB :: ' + id + ',' + ms.data.city.name);
			this.loadData(dummyExpense());
		};
		var loadData = function(data) {
			this.data.expense = data.expense;
		};
		var saveExpense = function() {
			// TODO Ajax save.
			console.log('Changes saved @ vDB :: ' + ms.data.city.name + ',' +
					JSON.stringify(this.data.expense));
			us.showMsg('Modify Expense', 'success');
		};
		var deleteExpense = function() {
			// TODO Ajax save.
			console.log('Deleted @ vDB :: ' + this.data.expense.id + ',' + ms.data.city.name);
			us.showMsg('Delete Expense', 'success');
		};
		var swapExpense = function(id1, id2) {
			// TODO Ajax save.
			console.log('Swapped @ vDB :: ' + id1 + ',' + id2 + ',' + ms.data.city.name);
		};
		var getBillsForAcc = function() {
			// TODO Ajax call to fetch Bills from DB.
			console.log('Fetching Bills data from @ vDB :: ' + this.data.expense.fromAcc.id + ',' +
					ms.data.city.name);
			return dummyBills();
		};

		return {
			data: data,
			loadExpense: loadExpense,
			loadData: loadData,
			saveExpense: saveExpense,
			deleteExpense: deleteExpense,
			swapExpense: swapExpense,
			getBillsForAcc: getBillsForAcc
		};
	}

})(window.angular);
