/** ** ./dashboard/dashboardwrapper.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard').factory('dashboardwrapperService', dashboardwrapperService);

	dashboardwrapperService.$inject = ['dashboardService', 'etmenuService', 'accountsService',
			'searchService', 'explistwrapperService', 'billsService', 'ajaxService', '$timeout'];
	function dashboardwrapperService(ds, ms, acs, ss, elws, bs, aj, $timeout) {
		var stepFour = function() {
			ms.data.loading = false;
			ds.data.loading.on = false;
		};
		var waitOnStepThree = function() {
			if (ds.data.loading.donestep === 3) {
				stepFour();
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
		return {
			loadPage: loadPage
		};
	}

})(window.angular);
