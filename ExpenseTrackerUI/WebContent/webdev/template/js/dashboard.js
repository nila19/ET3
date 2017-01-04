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
		$('#btnPayBill').click(function() {
			$('#modalPayBill').modal('show');
		});

		// On click of : Pay Bill OK
		$('#btnPayBillAction').click(function() {
			$('#modalPayBill').modal('hide');
			dashFunctions.showBillsTab('CLOSED');
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
		$('#cardExpenseList :button[data-btn-edit-expense]').click(function() {
			if ($(this).attr('data-btn-edit-expense') === 'DELETE') {
				$('#modalDeleteExpense').modal('show');
			}
		});

		// On click of : Delete Expense OK
		$('#btnDeleteExpenseAction').click(function() {
			$('#modalDeleteExpense').modal('hide');
			appUtils.msg.show('Delete Expense');
		});

		// On click of : Modify Expense from List
		$('#cardExpenseList :button[data-btn-edit-expense]').click(function() {
			if ($(this).attr('data-btn-edit-expense') === 'MODIFY') {
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

		dashEventMapper.map();
	}
};
