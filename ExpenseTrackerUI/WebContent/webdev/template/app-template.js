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
			appTemplate.msg.show('City Change');
		});
	},

	// Initialization method for Dashboard page
	initDashboard: function() {
		console.log('Initializing dashboard....');

		// Load Bills tabs based on account click
		$('#acct1').click(function() {
			console.log('BOA 7787 clicked....');
			$('#h_bills_open').removeClass('active').hide();
			$('#currentbills').hide();
			$('#h_bills_closed').addClass('active');
			$('#pastbills').show();
		});
		$('#acct3').click(function() {
			console.log('BOA VISA clicked....');
			$('#h_bills_closed').removeClass('active');
			$('#pastbills').hide();
			$('#h_bills_open').addClass('active').show();
			$('#currentbills').show();
		});

		// Hide second row of accounts
		$('div[data-et-row="2"]').hide();
		var row2shown = false;

		$('a#toggle2row').click(function() {
			console.log('2row clicked....');
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
			console.log('Add clicked....');
			if (addExpIcon) {
				$('#monthlyExpCard').hide();
				$('#addExpCard').show();
				$('#icn_addExp').hide();
				$('#icn_chart').show();
			} else {
				$('#addExpCard').hide();
				$('#monthlyExpCard').show();
				$('#icn_chart').hide();
				$('#icn_addExp').show();
			}
			addExpIcon = !addExpIcon;
		});

		// Add Expense / Adjustment card actions
		$('#input_to_acct').hide();
		$('#icn_addExp_save').hide();
		$('#tbAddExpense').click(function() {
			$('#input_to_acct').hide();
			$('#icn_addExp_save').hide();
		});

		// Map Tally buttons to messages
		$('span[data-button]').click(function() {
			var a = $(this);
			appTemplate.msg.show(a.attr('data-button'));
		});

		// FIXME Fix this.
		// Delete Expenses
		$('#tbl_ExpenseList :button[title="Delete"]').click(function() {
			$('#mdlDeleteExp').modal('show');
		});

		// TODO Fix this.
		// Modify Expense button click.
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
