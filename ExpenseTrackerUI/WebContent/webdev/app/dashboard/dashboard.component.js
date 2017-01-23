/** ** ./dashboard/dashboard.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard').component('dashboard', {
		templateUrl: 'dashboard/dashboard.htm',
		controller: DashboardController
	});

	DashboardController.$inject = ['dashboardService', 'dashboardFlagsService', 'etmenuService',
			'explistService', 'startupService', 'CONSTANTS', 'VALUES', '$timeout'];
	function DashboardController(ds, dfs, ms, els, sus, C, V, $timeout) {
		var vm = this;
		init();

		function init() {
			sus.loadAll();
			ms.data.page = C.PAGES.DASHBOARD;
			els.data.rowCount = C.SIZES.DASHBOARD_ROW;

			// Menu is not loaded yet; load the default city from V.
			ms.checkInit();

			setFlags();
			loadPage();
		}

		function setFlags() {
			dfs.setFlags();
		}

		// Load default bills & expenses once menu is loaded.
		function loadPage() {
			if (!V.data.city.id || ms.data.loading) {
				$timeout(function() {
					loadPage();
				}, 100);
			} else {
				ds.loadPage();
			}
		}
	}
})(window.angular);
