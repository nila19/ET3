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
			els.data.page = C.PAGES.SEARCH;
			els.data.rowCount = C.SIZES.SEARCH_ROW;
			els.data.filterApplied = false;

			// Check if sent from Summary page.
			if ($routeParams.mth || $routeParams.cat) {
				ss.data.expMonth = $routeParams.mth;
				ss.data.catId = $routeParams.cat;
				var cat = us.getById(V.categories, ss.data.catId);
				if (cat) {
					ss.data.category = cat.name;
				}
				console.log('Routed from Summary :: ' + ss.data.catId + ' , ' + ss.data.expMonth);
				els.data.filterApplied = true;
			}

			console.log('City = ' + JSON.stringify(ms.data.city));

			// Run default search.
			loadData();

			typeAheads();
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

		function loadData() {
			var result = ss.doSearch(ms.data.city);
			els.loadData(result);
		}

		function doSearch() {
			els.data.filterApplied = true;
			loadData();
		}
	}
})(window.angular);
