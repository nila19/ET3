/** ** ./search/search.service.js *** */

(function(angular) {
	'use strict';

	angular.module('search').factory('searchService', searchService);

	searchService.$inject = ['ajaxService', 'explistService', 'etmenuService'];
	function searchService(aj, els, ms) {
		var data = {};

		var initializeData = function() {
			this.data.category = '';
			this.data.description = '';
			this.data.amount = '';
			this.data.account = '';
			this.data.transMonth = '';
			this.data.entryMonth = '';
			this.data.adjustInd = '';
			this.data.adhocInd = '';
		};
		var buildSearchInput = function() {
			var input = {
				city: ms.data.menu.city.id,
				description: data.description,
				amount: data.amount,
				adjustInd: data.adjustInd,
				adhocInd: data.adhocInd
			};
			if (data.category && data.category.id) {
				input.categoryId = data.category.id;
			}
			if (data.account && data.account.id) {
				input.accountId = data.account.id;
			}
			if (data.transMonth && data.transMonth.id) {
				input.transMonth = data.transMonth.id;
			}
			if (data.entryMonth && data.entryMonth.id) {
				input.entryMonth = data.entryMonth.id;
			}
			return input;
		};
		var loadResults = function(data) {
			els.loadData(data);
		};
		var doSearch = function() {
			var input = buildSearchInput();
			console.log('Search :: ' + JSON.stringify(input));
			els.data.loading = true;

			aj.query('/search/go', input, loadResults);
		};

		return {
			data: data,
			initializeData: initializeData,
			doSearch: doSearch,
			loadResults: loadResults
		};
	}

})(window.angular);
