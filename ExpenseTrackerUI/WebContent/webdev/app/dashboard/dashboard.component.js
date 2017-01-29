/** ** ./dashboard/dashboard.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard').component('dashboard', {
		templateUrl: 'dashboard/dashboard.htm',
		controller: DashboardController
	});

	DashboardController.$inject = ['dashboardwrapperService', 'dashboardService',
			'dashboardFlagsService', 'etmenuService', 'explistService', 'startupService',
			'searchService', 'CONSTANTS', 'VALUES', '$timeout'];
	function DashboardController(dws, ds, dfs, ms, els, sus, ss, C, V, $timeout) {
		var vm = this;
		init();

		function init() {
			sus.loadAll();
			ms.data.page = C.PAGES.DASHBOARD;
			els.data.rowCount = C.SIZES.DASHBOARD_ROW;
			els.data.thinList = true;
			els.data.thinListToggle = false;

			// Temporarily resize the EXPLIST to fit the page, until the search reloads the list.
			els.data.currPageNo = 0;
			els.loadCurrentPage();
			ss.initializeData();

			// If Menu is not loaded yet; load the default city from V.
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
				dws.loadPage();
			}
		}
	}
})(window.angular);
