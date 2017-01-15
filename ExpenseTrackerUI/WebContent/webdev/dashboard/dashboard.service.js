/** ** ./dashboard/dashboard.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard').factory('dashboardService', dashboardService);

	dashboardService.$inject = ['etmenuService', 'accountsService', 'addService', 'chartService'];
	function dashboardService(ms, acs, as, cs) {
		var toggleMoreAccounts = function() {
			ms.data.showingMoreAccounts = !ms.data.showingMoreAccounts;
			acs.data.showAcctsMore = !acs.data.showAcctsMore;
		};
		var toggleChart = function() {
			ms.data.showingChart = !ms.data.showingChart;
			as.data.showAdd = !as.data.showAdd;
			cs.data.showChart = !cs.data.showChart;
			cs.renderChart();
		};
		return {
			toggleMoreAccounts: toggleMoreAccounts,
			toggleChart: toggleChart
		};
	}

})(window.angular);
