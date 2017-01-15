/** ** ./dashboard/add/add.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.add').factory('addService', addService);

	addService.$inject = ['etmenuService', 'utilsService'];
	function addService(ms, us) {
		var data = {
			showAdd: false,
			tabs: {
				expense: 'tabcontentAddExpense',
				adjustment: 'tabcontentAddAdjustment'
			},
			adjust: false,
			adhoc: false,
			cat: {},
			fromAc: {},
			toAc: {}
		};

		var addExpense = function() {
			// TODO Ajax add to database.
			console.log('Adding expense @ vDB :: ' + ms.data.city.name + ',' +
					JSON.stringify(this.data));
			us.showMsg('Add Expense', 'success');
		};

		return {
			data: data,
			addExpense: addExpense
		};
	}

})(window.angular);
