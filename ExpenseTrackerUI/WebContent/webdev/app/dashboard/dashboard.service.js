/** ** ./dashboard/dashboard.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard').factory('dashboardService', dashboardService);

	dashboardService.$inject = ['etmenuService', 'accountsService', 'searchService',
			'explistwrapperService', 'billsService', 'ajaxService'];
	function dashboardService(ms, acs, ss, elws, bs, aj) {
		var getPageThree = function() {
			ss.data.account = null;
			ss.data.bill = null;
			elws.reloadExpenses();
			ms.data.loading = false;
		};
		var getPageTwo = function() {
			bs.loadAllBills();
			getPageThree();
		};
		var loadPageOne = function(data) {
			acs.loadData(data);
			getPageTwo();
		};
		var getPageOne = function() {
			var input = {
				city: ms.data.menu.city.id,
			};
			aj.query('/startup/accounts', input, loadPageOne);
		};
		var loadPage = function() {
			ms.data.loading = true;
			getPageOne();
		};
		return {
			loadPage: loadPage,
		};
	}

})(window.angular);
