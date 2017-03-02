/** ** ./dashboard/dashboardwrapper.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard').factory('dashboardwrapperService', dashboardwrapperService);

	dashboardwrapperService.$inject = ['dashboardService', 'etmenuService', 'accountsService',
			'searchService', 'explistService', 'explistwrapperService', 'billsService',
			'chartService', 'ajaxService', '$timeout'];
	function dashboardwrapperService(ds, ms, acs, ss, els, elws, bs, cs, aj, $timeout) {
		var wait = 200;
		var stepFive = function() {
			// Don't wait for Step 4 to be complete... Reduces the page loading time.
			ms.data.loading = false;
			ds.data.loading.on = false;
		};
		var stepFour = function() {
			if (ds.data.loading.donestep === 3) {
				// cs.loadChart();
				stepFive();
			} else {
				$timeout(function() {
					stepFour();
				}, wait);
			}
		};
		var stepThree = function() {
			if (ds.data.loading.donestep === 2) {
				elws.reloadExpenses();
				stepFour();
			} else {
				$timeout(function() {
					stepThree();
				}, wait);
			}
		};
		var stepTwo = function() {
			if (ds.data.loading.donestep === 1) {
				bs.loadAllBills();
				stepThree();
			} else {
				$timeout(function() {
					stepTwo();
				}, wait);
			}
		};
		var stepOne = function() {
			acs.loadAllAccounts();
			stepTwo();
		};
		var loadPage = function() {
			ms.data.loading = true;
			ds.data.loading.on = true;
			ds.data.loading.donestep = 0;
			stepOne();
		};
		var initialize = function() {
			els.data.thinList = true;
			els.data.thinListToggle = false;

			// Temporarily resize the EXPLIST to fit the page, until the search reloads the list.
			els.data.currPageNo = 0;
			els.loadCurrentPage();
			ss.initializeData();

			acs.data.filterBy = null;
			bs.data.filterApplied = false;
			bs.data.filterBy = null;
		};
		return {
			loadPage: loadPage,
			initialize: initialize
		};
	}

})(window.angular);
