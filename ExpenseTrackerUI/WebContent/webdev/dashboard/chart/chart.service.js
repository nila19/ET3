/** ** ./dashboard/chart/chart.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.chart').factory('chartService', chartService);

	chartService.$inject = ['CONSTANTS'];
	function chartService(C) {
		var data = {
			showChart: false,
			tagId: 'chartMonthlyExpense',
			labels: [],
			series: []
		};
		var chartOptions = {
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

		var dummyChart = function() {
			return {
				labels: ['Nov 16', 'Oct 16', 'Sep 16', 'Aug 16', 'Jul 16', 'Jun 16', 'May 16',
						'Apr 16', 'Mar 16', 'Feb 16', 'Jan 16', 'Dec 15'],
				series: [[1542.45, 443.56, 1320.25, 780.45, 553.43, 1453.45, 1326.45, 1434.45, 568,
						1610.75, 756.43, 1895.56]]
			};
		};

		var loadChartData = function() {
			console.log('Getting chart data @ vDB... ');
			// TODO Ajax query DB for chart data.
			this.loadData(dummyChart());
		};
		var loadData = function(data) {
			this.data.labels = data.labels;
			this.data.series = data.series;
		};
		var renderChart = function() {
			var chart = Chartist.Bar('#' + this.data.tagId, this.data, chartOptions,
					responsiveOptions);
			md.startAnimationForBarChart(chart);
		};

		return {
			data: data,
			loadChartData: loadChartData,
			loadData: loadData,
			renderChart: renderChart
		};
	}

})(window.angular);
