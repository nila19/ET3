var appUtils = {
	// Popup message
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

		var chart = Chartist
				.Bar('#chartMonthlyExpense', dataChart, optionsChart, responsiveOptions);
		md.startAnimationForBarChart(chart);
	}
};
