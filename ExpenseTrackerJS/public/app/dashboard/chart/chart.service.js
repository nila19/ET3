/** ** ./dashboard/chart/chart.service.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.chart').factory('chartService', chartService);

  chartService.$inject = ['etmenuService', 'dashboardService', 'ajaxService', 'CONSTANTS',
    '$timeout'];
  function chartService(ms, ds, aj, C, $timeout) {
    const wait = 200;
    const data = {
      showChart: false,
      loaded: false,
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
    const chartOptions = {
      axisX: {
        showGrid: false
      },
      axisY: {
        labelInterpolationFnc: function (value) {
          return '$' + value;
        }
      },
      low: 0,
      high: 3500,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 5
      }
    };
    const responsiveOptions = [['screen and (max-width: 640px)', {
      seriesBarDistance: 5,
      axisX: {
        labelInterpolationFnc: function (value) {
          return value[0];
        }
      }
    }]];

    const loadCurrentPage = function () {
      const pg = data.currPageNo;
      const cols = data.columns;

      data.pgData.labels = data.labels.slice(pg * cols, (pg + 1) * cols);
      data.pgData.series[0] = data.series[0].slice(pg * cols, (pg + 1) * cols);
      data.pgData.series[1] = data.series[1].slice(pg * cols, (pg + 1) * cols);
      data.pgData.series[2] = data.series[2].slice(pg * cols, (pg + 1) * cols);
    };
    const loadChartData = function (dt) {
      data.labels = dt.labels;
      data.series[0] = dt.regulars;
      data.series[1] = dt.adhocs;
      data.series[2] = dt.totals;
			// chartOptions.high = Math.max.apply(null, data.series[0]);

      data.maxPageNo = Math.ceil(data.labels.length / data.columns) - 1;
      data.currPageNo = 0;
      loadCurrentPage();
      data.loaded = true;
      ds.data.loading.donestep = 4;
    };
    const loadChart = function () {
      aj.get('/summary/chart', {
        city: ms.data.menu.city.id
      }, loadChartData);
    };
    var showChart = function () {
      if (data.loaded) {
        const chart = Chartist.Bar('#' + data.tagId, data.pgData, chartOptions,
						responsiveOptions);

        md.startAnimationForBarChart(chart);
      } else {
        $timeout(function () {
          showChart();
        }, wait);
      }
    };
    const renderChart = function () {
      if (!data.loaded) {
        loadChart();
      }
      showChart();
    };

    return {
      data: data,
      renderChart: renderChart,
      loadCurrentPage: loadCurrentPage
    };
  }
})(window.angular);
