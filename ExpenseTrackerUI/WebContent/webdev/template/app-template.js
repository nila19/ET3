var appTemplateChart = {
	// Dashboard Chart
	initChart: function() {
		var dataChart = {
			labels: ['Nov 16', 'Oct 16', 'Sep 16', 'Aug 16', 'Jul 16', 'Jun 16', 'May 16',
					'Apr 16', 'Mar 16', 'Feb 16', 'Jan 16', 'Dec 15'],
			series: [[1542.45, 443.56, 1320.25, 780.45, 553.43, 1453.45, 1326.45, 1434.45, 568,
					1610.75, 756.43, 1895.56]]
		};

		var optionsChart = {
			axisX: {
				showGrid: false
			},
			low: 0,
			high: 2500,
			chartPadding: {
				top: 0,
				right: 5,
				bottom: 0,
				left: 0
			}
		};

		var responsiveOptions = [['screen and (max-width: 640px)', {
			seriesBarDistance: 5,
			axisX: {
				labelInterpolationFnc: function(value) {
					return value[0];
				}
			}
		}]];

		var chart = Chartist.Bar('#dashboardChart', dataChart, optionsChart, responsiveOptions);
		md.startAnimationForBarChart(chart);
	}
};

var appTemplate = {
	// Notification message
	msg: {
		types: ['', 'info', 'success', 'warning', 'danger'],
		show: function(action) {
			$.notify({
				icon: 'notifications',
				message: '<b>' + action + '</b> - Completed successfully.'
			}, {
				type: 'success',
				delay: 1000,
				placement: {
					from: 'top',
					align: 'center'
				}
			});
		}
	},

	// Initialization method for navigation bar
	initNavbar: function() {
		console.log('Initializing navbar....');

		// Navbar change currency when city changes.
		$('#icn_currency_inr').hide();
		$('#et_city').find('a[data-currency]').click(function() {
			var a = $(this);
			var curr = a.attr('data-currency');
			$('#et_city').find('span[data-city-fl]').html(a.attr('data-city'));

			if (curr === 'INR') {
				$('#icn_currency_inr').show();
				$('#icn_currency_usd').hide();
			} else {
				$('#icn_currency_inr').hide();
				$('#icn_currency_usd').show();
			}
			$('#btn_explist_filterremove').hide();
			appTemplate.msg.show('City Change');
		});
	},

	// Initialization method for Dashboard page
	initDashboard: function() {
		console.log('Initializing dashboard....');

		// Load Bills tabs based on account click
		$('#acct1').click(function() {
			$('#h_bills_open').removeClass('active').hide();
			$('#tabcontentBillsCurrent').removeClass('active');
			$('#h_bills_closed').addClass('active');
			$('#tabcontentBillsPast').addClass('active');
			$('#btn_explist_filterremove').show();
			$('#btn_billlist_filterremove').show();
		});
		$('#acct3').click(function() {
			$('#h_bills_closed').removeClass('active');
			$('#tabcontentBillsPast').removeClass('active');
			$('#h_bills_open').addClass('active').show();
			$('#tabcontentBillsCurrent').addClass('active');
			$('#btn_explist_filterremove').show();
			$('#btn_billlist_filterremove').show();
		});

		// Hide second row of accounts
		$('div[data-et-row="2"]').hide();
		var row2shown = false;

		$('a#toggle2row').click(function() {
			if (row2shown) {
				$('div[data-et-row="2"]').hide();
				row2shown = !row2shown;
			} else {
				$('div[data-et-row="2"]').show();
				row2shown = !row2shown;
				$('a#toggle2row > i').html('expand_less');
			}
		});

		// AddExpense button / Chart button actions
		$('#monthlyExpCard').hide();
		$('#icn_addExp').hide();
		var addExpIcon = false;
		$('#btnAddExpense').click(function() {
			if (addExpIcon) {
				$('#monthlyExpCard').hide();
				$('#addExpCard').show();
				$('#icn_addExp').hide();
				$('#icn_chart').show();
			} else {
				$('#addExpCard').hide();
				$('#monthlyExpCard').show();
				appTemplateChart.initChart();
				$('#icn_chart').hide();
				$('#icn_addExp').show();
			}
			addExpIcon = !addExpIcon;
		});

		// Add Expense / Adjustment card actions
		$('#spn-exp-card-modify').hide();
		$('#input_bill').hide();
		$('#tabcontentAddExpense :button[data-btn-addExp-Action="CANCEL"]').hide();
		$('#icn_addExp_modify').hide();

		// Map Tally buttons to messages
		$('span[data-btn-tally]').click(function() {
			var a = $(this);
			appTemplate.msg.show(a.attr('data-btn-tally'));
		});

		// Map Bill Pay buttons to message
		$('#btnPayBill').click(function() {
			$('#h_bills_open').removeClass('active').hide();
			$('#tabcontentBillsCurrent').removeClass('active');
			$('#h_bills_closed').addClass('active');
			$('#tabcontentBillsPast').addClass('active');

			appTemplate.msg.show('Bill Pay');
		});

		// MODIFY / DELETE Expenses
		var btnEditModifyExp = $('#tbl_ExpenseList :button[data-btn-edit-exp]');
		btnEditModifyExp.click(function() {
			var a = $(this);
			var editFlag = a.attr('data-btn-edit-exp');

			if (editFlag === 'DELETE') {
				$('#mdlDeleteExp').modal('show');
			}
			if (editFlag === 'MODIFY') {
				// Hide the 'Add Expense' button at the Navbar.
				$('#btnAddExpense').hide();
				$('#monthlyExpCard').hide();
				$('#addExpCard').show();

				$('#spn-exp-card-add').hide();
				$('#spn-exp-card-modify').show();

				$('#h_add_exp').removeClass('active').hide();
				$('#h_add_adj').removeClass('active').hide();

				$('#input_bill').show();
				$('#tabcontentAddAdjustment').removeClass('active');
				$('#tabcontentAddExpense').addClass('active');
				$('#tabcontentAddExpense :button[data-btn-addExp-Action="CANCEL"]').show();
				$('#tabcontentAddExpense :button[data-btn-addExp-Action="ADD"]').attr(
						'data-btn-addExp-Action', 'MODIFY');
				$('#icn_addExp_add').hide();
				$('#icn_addExp_modify').show();
			}
		});

		$('#btnDeleteExpOK').click(function() {
			$('#mdlDeleteExp').modal('hide');
			appTemplate.msg.show('Delete Expense');
		});

		// ADD Adjustment Action
		var btnAddAdjustment = $('#tabcontentAddAdjustment :button[data-btn-addExp-Action]');
		btnAddAdjustment.click(function() {
			$('#btn_explist_filterremove').hide();
			appTemplate.msg.show('Add Adjustment');
		});

		// ADD / MODIFY / CANCEL Expenses Action
		var btnAddModifyCancel = $('#tabcontentAddExpense :button[data-btn-addExp-Action]');
		btnAddModifyCancel.click(function() {
			var a = $(this);
			var actionFlag = a.attr('data-btn-addExp-Action');
			if (actionFlag === 'ADD') {
				$('#btn_explist_filterremove').hide();
				appTemplate.msg.show(actionFlag + ' Expense');
			}

			if (actionFlag === 'MODIFY') {
				appTemplate.msg.show(actionFlag + ' Expense');
			}

			// If Modify or Cancel, then change the form back to ADD.
			if (actionFlag === 'MODIFY' || actionFlag === 'CANCEL') {
				// Show the 'Add Expense' button at the Navbar.
				$('#btnAddExpense').show();
				$('#icn_addExp').hide();
				$('#icn_chart').show();
				addExpIcon = false;

				$('#spn-exp-card-modify').hide();
				$('#spn-exp-card-add').show();

				$('#h_add_exp').addClass('active').show();
				$('#h_add_adj').show();

				$('#input_bill').hide();
				$('#tabcontentAddExpense :button[data-btn-addExp-Action="CANCEL"]').hide();
				$('#tabcontentAddExpense :button[data-btn-addExp-Action="MODIFY"]').attr(
						'data-btn-addExp-Action', 'ADD');
				$('#icn_addExp_add').show();
				$('#icn_addExp_modify').hide();
			}
		});

		// Expense List Filter
		$('#btn_explist_filterremove').hide();

		var btnBillFilterExpenses = $('#cardBills :button[data-btn-bill-filter-expenses]');
		btnBillFilterExpenses.click(function() {
			$('#btn_explist_filterremove').show();
		});

		$('#btn_explist_filterremove').click(function() {
			$('#btn_explist_filterremove').hide();
		});

		// Bill List Filter
		$('#btn_billlist_filterremove').hide();

		var btnAcctFilterBills = $(':button[data-btn-acct-filter-bills]');
		btnAcctFilterBills.click(function() {
			$('#btn_billlist_filterremove').show();
		});

		$('#btn_billlist_filterremove').click(function() {
			$('#btn_billlist_filterremove').hide();
		});
	},

	// Initialization method for Summary page
	initSummary: function() {
		$(':button[data-refresh-summary]').click(function() {
			appTemplate.msg.show('Summary Refresh');
		});
		$(':input[type="checkbox"]').change(function() {
			appTemplate.msg.show('Summary Refresh');
		});
	}

};
