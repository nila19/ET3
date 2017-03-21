/** ** ./dashboard/chart/chart.service.js *** */
/* eslint new-cap: ["error", { "capIsNewExceptions": ["Bar"] }], no-magic-numbers: 'off'*/

(function (angular) {
  'use strict';

  const chartService = function (ms, ds, aj, C) {
    const data = {
      showChart: false,
      loaded: false,
      labels: [],
      series: [],
      data: [],
      ds: [],
      options: {},
      cols: C.SIZES.CHART_COL
    };

    const buildDataSet = function () {
      data.options = {
        scales: {
          yAxes: [{
            ticks: {
              max: 5000
            }
          }]
        }
      };
      data.ds = [{
        label: 'Regular',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        type: 'bar'
      }, {
        label: 'Adhoc',
        backgroundColor: 'rgba(255,99,132, 0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        type: 'bar'
      }, {
        label: 'Total',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        type: 'line'
      }];
    };
    const loadChartData = function (dt) {
      // take only the data of the last 12 months for the chart.
      data.labels = dt.data.labels.slice(0, data.cols);
      data.series = ['Regular', 'Adhoc', 'Total'];
      data.data[0] = dt.data.regulars.slice(0, data.cols);
      data.data[1] = dt.data.adhocs.slice(0, data.cols);
      data.data[2] = dt.data.totals.slice(0, data.cols);
			// chartOptions.high = Math.max.apply(null, data.series[0]);

      buildDataSet();
      data.loaded = true;
      ds.data.loading.donestep = 4;
    };
    const getChartData = function () {
      aj.get('/summary/chart', {
        cityId: ms.data.menu.city.id
      }, loadChartData);
    };
    const renderChart = function () {
      if (!data.loaded) {
        getChartData();
      }
    };

    return {
      data: data,
      renderChart: renderChart,
    };
  };

  angular.module('dashboard.chart').factory('chartService', chartService);
  chartService.$inject = ['etmenuService', 'dashboardService', 'ajaxService', 'CONSTANTS'];
})(window.angular);
