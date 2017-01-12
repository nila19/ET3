/** ** ./dashboard/edit/edit.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.edit').service('editFunctionsService', editFunctionsService);

	editFunctionsService.$inject = ['CONSTANTS'];
	function editFunctionsService(C) {
		var fetchExp = function(id, data) {
			console.log('Fetching Exp data from @ vDB :: ' + id);
			// TODO Ajax to fetch
			// Dummy data
			data.id = 2500;
			data.data = {
				id: 2500,
				entryDt: 1288323623006,
				transDt: 1288323623006,
				cat: {
					id: 1750,
					name: 'Food ~ Kroger Groceries',
					main: 'Food',
					sub: 'Kroger Groceries',
					icon: 'local_mall'
				},
				desc: 'Costco Gas',
				amt: 34.50,
				fromAc: {
					id: 620,
					name: 'BOA - 7787'
				},
				fromFrom: 8944.60,
				fromTo: 8910.10,
				toAc: {
					id: 600,
					name: 'BOA VISA'
				},
				toFrom: 1240.55,
				toTo: 1206.05,
				adhoc: true,
				adjust: false,
				bill: {
					id: 21,
					name: 'BOA - 7787 - Bill #2'
				},
				bills: [{
					id: 20,
					name: 'BOA - 7787 - Bill #1'
				}, {
					id: 21,
					name: 'BOA - 7787 - Bill #2'
				}, {
					id: 22,
					name: 'BOA - 7787 - Bill #3'
				}]
			};
		};
		var saveExp = function(data) {
			// TODO Ajax save.
			console.log('Changes saved @ vDB :: ' + JSON.stringify(data));
		};
		var deleteExp = function(id) {
			// TODO Ajax save.
			console.log('Deleted @ vDB :: ' + id);
		};
		var swapExp = function(id, id2) {
			// TODO Ajax save.
			console.log('Swapped @ vDB :: ' + id + ' : ' + id2);
		};
		return {
			fetchExp: fetchExp,
			saveExp: saveExp,
			deleteExp: deleteExp,
			swapExp: swapExp
		};
	}

})(window.angular);
