/** ** ./search/search.component.js *** */

(function(angular) {
	'use strict';

	angular.module('search').component('search', {
		templateUrl: 'search/search.htm',
		controller: SearchController
	});

	SearchController.$inject = ['searchService', 'etmenuService', 'explistService', 'utilsService',
			'CONSTANTS', 'VALUES', '$routeParams'];
	function SearchController(ss, ms, els, us, C, V, $routeParams) {
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
			$('#category').typeahead({
				source: V.categories,
				minLength: 0,
				updater: function(item) {
					ss.data.categoryId = item.id;
					return item;
				}
			});
			$('#description').typeahead({
				source: V.descriptions
			});
			$('#expMonth, #entryMonth').typeahead({
				source: V.months,
				minLength: 0
			});
			$('#account').typeahead({
				source: V.accounts,
				minLength: 0,
				updater: function(item) {
					ss.data.accountId = item.id;
					return item;
				}
			});
		}

		function doSearch() {
			els.data.filterApplied = true;
			loadExpenses();
		}

		function loadExpenses() {
			els.loadAllExpenses();
		}
	}
})(window.angular);
