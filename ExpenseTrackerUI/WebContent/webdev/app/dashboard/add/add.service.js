/** ** ./dashboard/add/add.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.add').factory('addService', addService);

	addService.$inject = ['etmenuService', 'accountsService', 'explistwrapperService',
			'ajaxService', 'utilsService', 'CONSTANTS'];
	function addService(ms, acs, elws, aj, us, C) {
		var data = {
			showAdd: false,
			city: null,
			adjust: false,
			adhoc: false,
			category: null,
			fromAccount: null,
			toAccount: null,
			description: '',
			amount: '',
			transDate: ''
		};

		var initForm = function() {
			data.amount = '';
			data.description = '';
		};
		var loadData = function(dt) {
			initForm();
			us.showMsg('Add Expense', C.MSG.SUCCESS);
			// Add the newly added Expense to the top of the Expenselist..
			elws.addItem(dt.id);

			if (data.fromAccount && data.fromAccount.id) {
				acs.refreshAccount(data.fromAccount.id);
			}
			if (data.toAccount && data.toAccount.id) {
				acs.refreshAccount(data.toAccount.id);
			}
		};
		var addExpense = function() {
			data.city = ms.data.menu.city;
			aj.post('/entry/add', data, loadData);
		};

		return {
			data: data,
			addExpense: addExpense
		};
	}

})(window.angular);
