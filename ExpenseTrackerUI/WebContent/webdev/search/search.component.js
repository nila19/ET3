/** ** ./search/search.component.js *** */

(function(angular) {
	'use strict';

	angular.module('search').component('search', {
		templateUrl: 'search/search.htm',
		controller: SearchController
	});

	SearchController.$inject = ['searchService', 'etmenuService', 'explistService', 'CONSTANTS',
			'VALUES', '$location', '$routeParams'];
	function SearchController(ss, ms, els, C, V, $location, $routeParams) {
		var vm = this;

		init();
		// TODO Run default search.
		// TODO Check if sent from Summary - use $routeParams.
		// vm.cat = $routeParams.cat;
		// vm.mth = $routeParams.mth;

		// ***** Exposed functions ******//
		vm.doSearch = doSearch;

		// ***** Function declarations *****//
		function doSearch(form) {
			if (!form.$valid) {
				console.log('Form has errors. Please correct & resubmit.');
				// toastr.warning('Form has errors. Please correct & resubmit.');
				return;
			}
			console.log('City -' + ms.getCity() + ' :: Cat - ' + vm.categoryId + ' :: Acc - ' +
					vm.accountId + ' :: Desc - ' + vm.description + ' :: Exp M - ' + vm.expMonth);
			// TODO Do ajax search
		}

		function init() {
			els.setPage(C.PAGES.SEARCH);
			ms.setPage(C.PAGES.SEARCH);

			$('#category').typeahead({
				source: V.categories,
				minLength: 0,
				updater: function(item) {
					vm.categoryId = item.id;
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
					vm.accountId = item.id;
					return item;
				}
			});
		}
	}
})(window.angular);
