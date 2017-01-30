/** ** ./dashboard/dashboardwrapper.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard').factory('dashboardwrapperService', dashboardwrapperService);

	dashboardwrapperService.$inject = ['dashboardService', 'etmenuService', 'accountsService',
			'searchService', 'explistService', 'explistwrapperService', 'billsService',
			'chartService', 'ajaxService', '$timeout'];
	function dashboardwrapperService(ds, ms, acs, ss, els, elws, bs, cs, aj, $timeout) {
		var stepFive = function() {
			ms.data.loading = false;
			ds.data.loading.on = false;
		};
		var waitOnStepFour = function() {
			if (ds.data.loading.donestep === 4) {
				stepFive();
			} else {
				$timeout(function() {
					waitOnStepFour();
				}, 500);
			}
		};
		var stepFour = function() {
			cs.loadChart();
			waitOnStepFour();
		};
		var waitOnStepThree = function() {
			if (ds.data.loading.donestep === 3) {
				// FIXME - Fix the Charts.
				// stepFour();
				stepFive();
			} else {
				$timeout(function() {
					waitOnStepThree();
				}, 500);
			}
		};
		var stepThree = function() {
			ss.data.account = null;
			ss.data.bill = null;
			elws.reloadExpenses();
			waitOnStepThree();
		};
		var waitOnStepTwo = function() {
			if (ds.data.loading.donestep === 2) {
				stepThree();
			} else {
				$timeout(function() {
					waitOnStepTwo();
				}, 500);
			}
		};
		var stepTwo = function() {
			bs.loadAllBills();
			waitOnStepTwo();
		};
		var loadStepOne = function(dt) {
			acs.loadData(dt);
			ds.data.loading.donestep = 1;
			stepTwo();
		};
		var stepOne = function() {
			var input = {
				city: ms.data.menu.city.id,
			};
			aj.query('/startup/accounts', input, loadStepOne);
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
