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

			// Run default search.
			loadExpenses();
			typeAheads();
		}

		// Check if sent from Summary page.
		function isDrillDown() {
			if ($routeParams.drill && $routeParams.drill === 'Y') {
				var category = us.getById(V.categories, ss.data.categoryId);
				if (category) {
					ss.data.category = category.name;
				}
				console.log('Drill down :: ' + ss.data.categoryId + ' , ' + ss.data.expMonth);
				els.data.filterApplied = true;
			}
		}

		function typeAheads() {
			vm.ta = {};
			vm.ta.descriptions = V.descriptions;
			vm.ta.categories = V.categories;
			vm.ta.months = V.months;
			vm.ta.accounts = V.accounts;
		}

		function doSearch() {
			sus.testAjax();
			els.data.filterApplied = true;
			// TODO - fix this back.
			// loadExpenses();
		}

		function loadExpenses() {
			els.loadAllExpenses();
		}
	}
})(window.angular);
