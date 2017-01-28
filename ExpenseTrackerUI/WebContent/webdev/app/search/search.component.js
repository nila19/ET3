/** ** ./search/search.component.js *** */

(function(angular) {
	'use strict';

	angular.module('search').component('search', {
		templateUrl: 'search/search.htm',
		controller: SearchController
	});

	SearchController.$inject = ['searchService', 'etmenuService', 'startupService',
			'explistService', 'utilsService', 'CONSTANTS', 'VALUES', '$routeParams', '$timeout'];
	function SearchController(ss, ms, sus, els, us, C, V, $routeParams, $timeout) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.doSearch = doSearch;

		// ***** Function declarations *****//
		function init() {
			vm.data = ss.data;
			vm.ta = V.data;

			ms.data.page = C.PAGES.SEARCH;
			els.data.rowCount = C.SIZES.SEARCH_ROW;
			els.data.thinListToggle = true;
			// Temporarily resize the EXPLIST to fit the page, until the search reloads the list.
			els.data.currPageNo = 0;
			els.loadCurrentPage();

			// If menu is not loaded, load the default city from V.
			ms.checkInit();

			// Don't initialize if sent from Summary page.
			if (!$routeParams.drill) {
				ss.initializeData();
			}
			initSearch();
		}

		function initSearch() {
			if (!V.data.city.id || ms.data.loading) {
				$timeout(function() {
					initSearch();
				}, 500);
			} else {
				ss.doSearch();
			}
		}

		function doSearch() {
			ss.doSearch();
		}
	}
})(window.angular);
