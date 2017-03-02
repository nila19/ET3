/** ** ./dashboard/dashboard.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard').component('dashboard', {
		templateUrl: 'dashboard/dashboard.htm',
		controller: DashboardController
	});

	DashboardController.$inject = ['dashboardwrapperService', 'dashboardService',
			'dashboardFlagsService', 'etmenuService', 'explistService', 'searchService',
			'CONSTANTS', 'VALUES', '$timeout'];
	function DashboardController(dws, ds, dfs, ms, els, ss, C, V, $timeout) {
		var vm = this;
		init();

		function init() {
			ms.data.page = C.PAGES.DASHBOARD;
			els.data.rowCount = C.SIZES.DASHBOARD_ROW;

			// If Menu is not loaded yet; load the default city from V.
			ms.checkInit();

			dws.initialize();
			dfs.setFlags();
			loadPage();
		}

		// Load default bills & expenses once menu is loaded.
		function loadPage() {
			if (!V.data.city.id || ms.data.loading) {
				$timeout(function() {
					loadPage();
				}, 100);
			} else {
				dws.loadPage();
			}
		}
	}
})(window.angular);
