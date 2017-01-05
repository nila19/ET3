/** ** ./dashboard/dashboard.component.js *** */

var dashFlags = {
	rowAdditionalAccounts: false,
	addExpenseShowChart: true
};

var dashFunctions = {
	showBillsTab: function(flag) {
		if (flag === 'CLOSED') {
			$('#tabheaderBillsOpen').removeClass('active').hide();
			$('#tabcontentBillsOpen').removeClass('active');
			$('#tabheaderBillsClosed').addClass('active');
			$('#tabcontentBillsClosed').addClass('active');
		} else {
			$('#tabheaderBillsClosed').removeClass('active').hide();
			$('#tabcontentBillsClosed').removeClass('active');
			$('#tabheaderBillsOpen').addClass('active');
			$('#tabcontentBillsOpen').addClass('active');
		}
	},

	showUnFilterOnBillsExpenses: function() {
		$('#btn_unfilter_expenseslist').show();
		$('#btn_unfilter_billslist').show();
	},

	toggleRowAdditionalAccounts: function() {
		if (dashFlags.rowAdditionalAccounts) {
			$('div[data-row-additional-accounts]').hide();
			$('#icon_expand_less').hide();
			$('#icon_expand_more').show();
		} else {
			$('div[data-row-additional-accounts]').show();
			$('#icon_expand_more').hide();
			$('#icon_expand_less').show();
		}
		dashFlags.rowAdditionalAccounts = !dashFlags.rowAdditionalAccounts;
	},

	toggleAddExpenseShowChart: function() {
		if (dashFlags.addExpenseShowChart) {
			$('#icon_add_expense').hide();
			$('#icon_show_chart').show();
			$('#cardMonthlyExpenseChart').hide();
			$('#cardAddExpense').show();
		} else {
			$('#icon_show_chart').hide();
			$('#icon_add_expense').show();
			$('#cardAddExpense').hide();
			$('#cardMonthlyExpenseChart').show();
			appUtils.initChart();
		}
		dashFlags.addExpenseShowChart = !dashFlags.addExpenseShowChart;
	},

	initAddExpenseCard: function() {
		// Initialize Add Expense card
		$('#tabheaderAddExpense').addClass('active').show();
		$('#tabcontentAddAdjustment').removeClass('active');
		$('#tabcontentAddExpense').addClass('active').show();
	},

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

		var fields = {
			descriptions: ['txtAddExp_Description', 'txtAddAdj_Description',
					'txtModify_Description'],
			accounts: ['txtAddExp_FromAccount', 'txtAddAdj_FromAccount', 'txtAddAdj_ToAccount',
					'txtPayBill_FromAccount', 'txtModify_FromAccount', 'txtModify_ToAccount'],
			categories: ['txtAddExp_Category', 'txtModify_Category']
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
	}
};

var dashEventMapper = {
	map: function() {
		// On click of : Accounts Card
		$('div[data-card-accounts]').click(function() {
			var a = $(this);
			var closed = a.attr('data-card-accounts') === 'CREDIT' ? 'CLOSED' : 'OPEN';

			dashFunctions.showBillsTab(closed);
			dashFunctions.showUnFilterOnBillsExpenses();
		});

		// On click of : Toggle Row of Additional Accounts
		$('#btnToggleRowAdditionalAccounts').click(function() {
			dashFunctions.toggleRowAdditionalAccounts();
		});

		// On click of : UnFilter ExpensesList
		$('#btn_unfilter_expenseslist').click(function() {
			$('#btn_unfilter_expenseslist').hide();
		});

		// On click of : View Expenses for Bill
		$('#cardBills :button[data-btn-view-expenses-for-bill]').click(function() {
			$('#btn_unfilter_expenseslist').show();
		});

		// On click of : UnFilter BillsList
		$('#btn_unfilter_billslist').click(function() {
			$('#btn_unfilter_billslist').hide();
		});

		// On click of : ToggleAddExpenseShowChart
		$('#btnToggleAddExpenseShowChart').click(function() {
			dashFunctions.toggleAddExpenseShowChart();
		});

		// On click of : Tally buttons
		$('span[data-btn-tally]').click(function() {
			appUtils.msg.show('Tally');
		});

		// On click of : Pay Bill
		$('#tabcontentBillsOpen [data-btn-pay-bill]').click(function() {
			$('#modalPayBill').modal('show');
		});

		// On click of : Pay Bill OK
		$('#btnPayBillAction').click(function() {
			$('#modalPayBill').modal('hide');
			appUtils.msg.show('Bill Pay');
		});

		// On click of : Add Expense
		$('#btnAddExpense').click(function() {
			$('#btn_unfilter_expenseslist').hide();
			appUtils.msg.show('Add Expense');
		});

		// On click of : Add Adjustment
		$('#btnAddAdjustment').click(function() {
			$('#btn_unfilter_expenseslist').hide();
			appUtils.msg.show('Add Adjustment');
		});

		// On click of : Delete Expense from List
		$('#cardExpenseList :button[data-btn-edit-expense]').click(
				function() {
					if ($(this).attr('data-btn-edit-expense') === 'DELETE') {
						dashFunctions.initEditExpModel('DELETE', $(this).attr(
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
						dashFunctions.initEditExpModel('MODIFY', $(this).attr(
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

var dashMain = {
	init: function() {
		// Re-initialize flags
		dashFlags.rowAdditionalAccounts = false;
		dashFlags.addExpenseShowChart = true;

		// Hide Additional row of Accounts
		$('div[data-row-additional-accounts]').hide();
		$('#icon_expand_less').hide();
		$('#icon_expand_more').show();

		// Hide Expense List & Bills List unfilters
		$('#btn_unfilter_expenseslist').hide();
		$('#btn_unfilter_billslist').hide();

		// Hide Monthly Expenses Chart
		dashFunctions.toggleAddExpenseShowChart();

		dashFunctions.initAddExpenseCard();
		dashFunctions.initTypeAheads();

		dashEventMapper.map();
	}
};

(function(angular) {
	'use strict';

	angular.module('dashboard').component('dashboard', {
		templateUrl: 'dashboard/dashboard.htm',
		controller: DashboardController
	});

	DashboardController.$inject = ['dashboardService', 'CONSTANTS', '$location'];
	function DashboardController(ds, CONSTANTS, $location) {
		var vm = this;

		// TODO - Break this into multiple sub-components.
		dashMain.init();
		// /////////////////////
	}
})(window.angular);
