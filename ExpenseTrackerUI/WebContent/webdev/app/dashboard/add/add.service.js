/** ** ./dashboard/add/add.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.add').factory('addService', addService);

	addService.$inject = ['etmenuService', 'utilsService', 'CONSTANTS'];
	function addService(ms, us, C) {
		var data = {
			showAdd: false,
			adjust: false,
			adhoc: false,
			category: '',
			fromAcc: '',
			toAcc: '',
			description: '',
			amount: '',
			transDt: '',
		};

		var initForm = function(d) {
			d.amount = '';
			d.description = '';
		};
		var addExpense = function() {
			// TODO Ajax add to database.
			console.log('Adding expense @ vDB :: ' + ms.data.menu.city.name + ',' +
					JSON.stringify(this.data));
			us.showMsg('Add Expense', C.MSG.SUCCESS);
			initForm(this.data);
		};

		return {
			data: data,
			addExpense: addExpense
		};
	}

})(window.angular);
