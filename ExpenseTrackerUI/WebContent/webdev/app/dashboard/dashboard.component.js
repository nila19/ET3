/** ** ./dashboard/dashboard.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard').component('dashboard', {
		templateUrl: 'dashboard/dashboard.htm',
		controller: DashboardController
	});

	DashboardController.$inject = ['dashboardService', 'etmenuService', 'accountsService',
			'billsService', 'addService', 'chartService', 'explistService', 'startupService',
			'CONSTANTS'];
	function DashboardController(ds, ms, acs, bs, as, cs, els, sus, C) {
		var vm = this;
		init();

		function init() {
			sus.loadAll();
			ms.data.page = C.PAGES.DASHBOARD;
			els.data.rowCount = C.SIZES.DASHBOARD_ROW;

			// Menu is not loaded yet; load the default city.
			ms.checkInit();

			setFlags();
			loadPage();
		}

		function setFlags() {
			els.data.filterApplied = false;

			acs.data.showAcctsRowOne = true;
			as.data.showAdd = true;
			bs.data.showBills = true;

			ms.data.showingMoreAccounts = false;
			acs.data.showAcctsMore = false;
			ms.data.showingChart = false;
			cs.data.showChart = false;
		}

		// Load default bills & expenses.
		function loadPage() {
			acs.loadAccountDetails();
			bs.loadAllBills();
			els.loadAllExpenses();
		}
	}
})(window.angular);