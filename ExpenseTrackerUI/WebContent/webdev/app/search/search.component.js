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

			// If menu is not loaded, load the default city from V.
			ms.checkInit();

			ss.initializeData();
			isDrillDown();
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

		// Check if sent from Summary page.
		function isDrillDown() {
			if ($routeParams.drill && $routeParams.drill === 'Y') {
				var category = us.getObjectOf(V.data.categories, ss.data.category.id);
				if (category) {
					ss.data.category = category;
				}
				console.log('Drill down :: ' + ss.data.category.id + ' , ' + ss.data.expMonth);
			}
		}

		function doSearch() {
			ss.doSearch();
		}
	}
})(window.angular);
