/** ** ./search/search.component.js *** */

var searchFunctions = {
	initEditExpModel: function(action, type) {
		if (action === 'DELETE') {
			$('#modalDeleteExpense [data-edit-exp-field]').hide();
			$('#modalDeleteExpense [data-edit-exp-field = "' + type + '"]').show();
		}
		if (action === 'MODIFY') {
			$('#modalModifyExpense [data-edit-exp-field]').hide();
			$('#modalModifyExpense [data-edit-exp-field = "' + type + '"]').show();
		}
	},

	initTypeAheads: function() {
		var descriptions = ['Kroger', 'Kroger Groceries', 'Walmart', 'Costco', 'CreditCard Bill',
				'Cash', 'Walgreens'];
		var accounts = ['BOA - 7787', 'BOA VISA', 'Chase Freedom', 'Chase Checking', 'Blue Cash',
				'Gap VISA', 'Cash Bala', 'Cash Anitha', 'HSA'];
		var categories = ['Food ~ Kroger Groceries', 'Transport ~ Car Gas',
				'Shopping ~ Restaurant', 'Shopping ~ Shopping', 'House ~ Rent'];
		var months = ['Dec-16', 'Oct-16', 'Sep-16', 'Aug-16', 'Jul-16', 'Jun-16'];

		var fields = {
			descriptions: ['txtSearch_Description'],
			accounts: ['txtSearch_Account'],
			categories: ['txtSearch_Category'],
			months: ['txtSearch_ExpMonth', 'txtSearch_EntryMonth']
		};

		$.each(fields.descriptions, function(i, description) {
			$('#' + description).typeahead({
				source: descriptions,
				minLength: 0
			});
		});

		$.each(fields.accounts, function(i, account) {
			$('#' + account).typeahead({
				source: accounts,
				minLength: 0
			});
		});

		$.each(fields.categories, function(i, category) {
			$('#' + category).typeahead({
				source: categories,
				minLength: 0
			});
		});

		$.each(fields.months, function(i, month) {
			$('#' + month).typeahead({
				source: months,
				minLength: 0
			});
		});
	}
};

var searchEventMapper = {
	map: function() {
		// On click of : Delete Expense from List
		$('#cardExpenseList :button[data-btn-edit-expense]').click(
				function() {
					if ($(this).attr('data-btn-edit-expense') === 'DELETE') {
						searchFunctions.initEditExpModel('DELETE', $(this).attr(
								'data-btn-edit-expense-type'));
						$('#modalDeleteExpense').modal('show');
					}
				});

		// On click of : Delete Expense OK
		$('#btnDeleteExpenseAction').click(function() {
			$('#modalDeleteExpense').modal('hide');
			appUtils.msg.show('Delete Expense');
		});

		// On click of : Modify Expense from List
		$('#cardExpenseList :button[data-btn-edit-expense]').click(
				function() {
					if ($(this).attr('data-btn-edit-expense') === 'MODIFY') {
						searchFunctions.initEditExpModel('MODIFY', $(this).attr(
								'data-btn-edit-expense-type'));
						$('#modalModifyExpense').modal('show');
					}
				});

		// On click of : Modify Expense OK
		$('#btnModifyExpenseAction').click(function() {
			$('#modalModifyExpense').modal('hide');
			appUtils.msg.show('Modify Expense');
		});
	}
};

var searchMain = {
	init: function() {
		searchEventMapper.map();
		searchFunctions.initTypeAheads();
	}
};

(function(angular) {
	'use strict';

	angular.module('search').component('search', {
		templateUrl: 'search/search.htm',
		controller: SearchController
	});

	SearchController.$inject = ['searchService', 'CONSTANTS', '$location'];
	function SearchController(ss, CONSTANTS, $location) {
		var vm = this;

		searchMain.init();
		// /////////////////////
	}
})(window.angular);
