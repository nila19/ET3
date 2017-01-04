var appFlags = {
	rowAdditionalAccounts: false,
	addExpenseShowChart: true
};

var appFunx = {
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
		if (appFlags.rowAdditionalAccounts) {
			$('div[data-row-additional-accounts]').hide();
			$('#icon_expand_less').hide();
			$('#icon_expand_more').show();
		} else {
			$('div[data-row-additional-accounts]').show();
			$('#icon_expand_more').hide();
			$('#icon_expand_less').show();
		}
		appFlags.rowAdditionalAccounts = !appFlags.rowAdditionalAccounts;
	},

	toggleAddExpenseShowChart: function() {
		if (appFlags.addExpenseShowChart) {
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
		appFlags.addExpenseShowChart = !appFlags.addExpenseShowChart;
	},

	initAddExpenseCard: function() {
		// Initialize Add Expense card
		$('#tabheadertitleModifyExpense').hide();
		$('#tabheadertitleAddExpense').show();
		$('#tabheaderAddAdjustment').show();
		$('#tabheaderAddExpense').addClass('active').show();
		$('#tabcontentAddAdjustment').removeClass('active');
		$('#tabcontentAddExpense').addClass('active').show();

		$('#txtBillOnExpense').hide();
		$('#tabcontentAddExpense :button[data-btn-addExpense-Action="CANCEL"]').hide();
		$('#tabcontentAddExpense :button[data-btn-addExpense-Action="ADD"]').attr(
				'data-btn-addExpense-Action', 'ADD');
		$('#icon_addExpense_modify').hide();
		$('#icon_addExpense_add').show();
	},

	initModifyExpenseCard: function() {
		// Initialize Modify Expense card
		$('#tabheadertitleAddExpense').hide();
		$('#tabheadertitleModifyExpense').show();
		$('#tabheaderAddAdjustment').removeClass('active').hide();
		$('#tabheaderAddExpense').removeClass('active').hide();
		$('#tabcontentAddAdjustment').removeClass('active');
		$('#tabcontentAddExpense').addClass('active').show();

		$('#txtBillOnExpense').show();
		$('#tabcontentAddExpense :button[data-btn-addExpense-Action="CANCEL"]').show();
		$('#tabcontentAddExpense :button[data-btn-addExpense-Action="ADD"]').attr(
				'data-btn-addExpense-Action', 'MODIFY');
		$('#icon_addExpense_add').hide();
		$('#icon_addExpense_modify').show();
	}
};

var appEventMapper = {
	map: function() {
		// On click of : Accounts Card
		$('div[data-card-accounts]').click(function() {
			var a = $(this);
			var closed = a.attr('data-card-accounts') === 'CREDIT' ? 'CLOSED' : 'OPEN';

			appFunx.showBillsTab(closed);
			appFunx.showUnFilterOnBillsExpenses();
		});

		// On click of : Toggle Row of Additional Accounts
		$('#btnToggleRowAdditionalAccounts').click(function() {
			appFunx.toggleRowAdditionalAccounts();
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
			appFunx.toggleAddExpenseShowChart();
		});

		// On click of : Tally buttons
		$('span[data-btn-tally]').click(function() {
			appUtils.msg.show('Tally');
		});

		// On click of : Pay Bill
		$('#btnPayBill').click(function() {
			appFunx.showBillsTab('CLOSED');
			appUtils.msg.show('Bill Pay');
		});

		// On click of : Add Expense
		$('#tabcontentAddExpense :button[data-btn-addExpense-Action]').click(function() {
			if ($(this).attr('data-btn-addExpense-Action') === 'ADD') {
				$('#btn_unfilter_expenseslist').hide();
				appUtils.msg.show('Add Expense');
			}
		});

		// On click of : Add Adjustment
		$('#tabcontentAddAdjustment :button[data-btn-addExpense-Action]').click(function() {
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
				// Hide the 'Add Expense' button at the Navbar.
				appFlags.addExpenseShowChart = true;
				appFunx.toggleAddExpenseShowChart();
				$('#btnToggleAddExpenseShowChart').hide();

				appFunx.initModifyExpenseCard();
			}
		});

		// On click of : Modify Expense OK
		$('#tabcontentAddExpense :button[data-btn-addExpense-Action]').click(function() {
			if ($(this).attr('data-btn-addExpense-Action') === 'MODIFY') {
				appUtils.msg.show('Modify Expense');
			}
		});

		// On click of : Modify Expense OK or CANCEL
		$('#tabcontentAddExpense :button[data-btn-addExpense-Action]').click(function() {
			var action = $(this).attr('data-btn-addExpense-Action');
			if (action === 'MODIFY' || action === 'CANCEL') {
				// Restore the 'Add Expense' button at the Navbar.
				appFlags.addExpenseShowChart = true;
				appFunx.toggleAddExpenseShowChart();
				$('#btnToggleAddExpenseShowChart').show();

				appFunx.initAddExpenseCard();
			}
		});
	}
};

var appDashboard = {
	init: function() {
		// Re-initialize flags
		appFlags.rowAdditionalAccounts = false;
		appFlags.addExpenseShowChart = true;

		// Hide Additional row of Accounts
		$('div[data-row-additional-accounts]').hide();
		$('#icon_expand_less').hide();
		$('#icon_expand_more').show();

		// Hide Expense List & Bills List unfilters
		$('#btn_unfilter_expenseslist').hide();
		$('#btn_unfilter_billslist').hide();

		// Hide Monthly Expenses Chart
		appFunx.toggleAddExpenseShowChart();

		appFunx.initAddExpenseCard();

		appEventMapper.map();
	}
};
