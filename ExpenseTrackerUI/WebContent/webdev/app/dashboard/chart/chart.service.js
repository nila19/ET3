/** ** ./dashboard/chart/chart.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.chart').factory('chartService', chartService);

	chartService.$inject = ['etmenuService', 'dashboardService', 'ajaxService', 'CONSTANTS'];
	function chartService(ms, ds, aj, C) {
		var data = {
			showChart: false,
			tagId: 'chartMonthlyExpense',
			labels: [],
			series: [],
			pgData: {
				labels: [],
				series: []
			},
			maxPageNo: 0,
			currPageNo: 0,
			columns: C.SIZES.CHART_COL
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

		var renderChart = function() {
			var chart = Chartist
					.Bar('#' + data.tagId, data.pgData, chartOptions, responsiveOptions);
			md.startAnimationForBarChart(chart);
		};
		var findMax = function(series) {
			var max = 0;
			angular.forEach(series, function(value) {
				if (value > max) {
					max = value;
				}
			});
			return max;
		};
		var loadCurrentPage = function() {
			var pg = data.currPageNo;
			var cols = data.columns;
			data.pgData.labels = data.labels.slice(pg * cols, (pg + 1) * cols);
			data.pgData.series = data.series.slice(pg * cols, (pg + 1) * cols);
		};
		var loadChartData = function(dt) {
			data.labels = dt.labels;
			data.series = dt.values;
			chartOptions.high = findMax(data.series);

			data.maxPageNo = Math.ceil(data.labels.length / data.columns) - 1;
			data.currPageNo = 0;
			loadCurrentPage();
			ds.data.loading.donestep = 4;
		};
		var loadChart = function() {
			aj.get('/summary/chart', {
				city: ms.data.menu.city.id
			}, loadChartData);
		};

		return {
			data: data,
			loadChart: loadChart,
			renderChart: renderChart
		};
	}

})(window.angular);
