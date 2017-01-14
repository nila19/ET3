/** ** ./dashboard/add/add.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.add').factory('addService', addService);

	addService.$inject = ['CONSTANTS'];
	function addService(C) {
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
			console.log('Adding expense @ vDB :: ' + JSON.stringify(this.data));
		};

		return {
			data: data,
			addExpense: addExpense
		};
	}

})(window.angular);
