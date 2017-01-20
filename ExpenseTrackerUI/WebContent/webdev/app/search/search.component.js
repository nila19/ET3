/** ** ./search/search.component.js *** */

(function(angular) {
	'use strict';

	angular.module('search').component('search', {
		templateUrl: 'search/search.htm',
		controller: SearchController
	});

	SearchController.$inject = ['searchService', 'etmenuService', 'explistService', 'utilsService',
			'CONSTANTS', 'VALUES', '$routeParams', 'startupService'];
	function SearchController(ss, ms, els, us, C, V, $routeParams, sus) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.doSearch = doSearch;

		// ***** Function declarations *****//
		function init() {
			vm.data = ss.data;
			ms.data.page = C.PAGES.SEARCH;
			els.data.rowCount = C.SIZES.SEARCH_ROW;
			els.data.filterApplied = false;

			// If menu is not loaded, load the default city.
			ms.checkInit();

			isDrillDown();

			vm.ta = V.data;
		}

		// Check if sent from Summary page.
		function isDrillDown() {
			if ($routeParams.drill && $routeParams.drill === 'Y') {
				var category = us.getById(V.data.categories, ss.data.category.id);
				if (category) {
					ss.data.category = category;
				}
				console.log('Drill down :: ' + ss.data.category.id + ' , ' + ss.data.expMonth);

				// Run default search.
				doSearch();
			}
		}

		function doSearch() {
			els.data.filterApplied = true;
			ss.doSearch();
		}
	}
})(window.angular);
