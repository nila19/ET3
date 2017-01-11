/** ** ./search/search.component.js *** */

(function(angular) {
	'use strict';

	angular.module('search').component('search', {
		templateUrl: 'search/search.htm',
		controller: SearchController
	});

	SearchController.$inject = ['searchService', 'etmenuService', 'explistService', 'utilsService',
			'CONSTANTS', 'VALUES', '$location', '$routeParams'];
	function SearchController(ss, ms, els, us, C, V, $location, $routeParams) {
		var vm = this;
		vm.data = {};

		init();

		// ***** Exposed functions ******//
		vm.doSearch = doSearch;

		// ***** Function declarations *****//
		function init() {
			ms.page = C.PAGES.SEARCH;
			els.page = C.PAGES.SEARCH;
			els.rowCount = C.SIZES.SEARCH_ROW;

			// Check if sent from Summary - use $routeParams.
			vm.data.expMonth = $routeParams.mth;
			vm.data.catId = $routeParams.cat;
			// FIXME Find out why getById is returning null.
			vm.data.category = us.getById(V.categories, vm.data.catId);
			if (vm.data.category || vm.data.expMonth) {
				console
						.log('Delegated from Summary :: ' + vm.data.catId + ' , ' +
								vm.data.expMonth);
			}

			// Run default search.
			doSearch();

			typeAheads();
		}

		function typeAheads() {
			$('#category').typeahead({
				source: V.categories,
				minLength: 0,
				updater: function(item) {
					vm.data.catId = item.id;
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
					vm.data.acId = item.id;
					return item;
				}
			});
		}

		function doSearch() {
			var result = ss.doSearch(ms.city, vm.data);
			els.loadData(result); // Refresh ExpenseList.
		}
	}
})(window.angular);
