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
		var addProp = function(input, ip, dp) {
			var prop = data[dp];
			if (prop && prop.id) {
				input[ip] = prop.id;
			}
		};
		var buildSearchInput = function() {
			var input = {
				city: ms.data.menu.city.id,
			};
			if (data.description && data.description !== '') {
				input.description = data.description;
			}
			if (data.amount && data.amount !== '' && data.amount !== 0) {
				input.amount = data.amount;
			}
			addProp(input, 'categoryId', 'category');
			addProp(input, 'accountId', 'account');
			addProp(input, 'billId', 'bill');
			if (data.transMonth && data.transMonth.id) {
				input.transMonth = data.transMonth.id;
			}
			if (data.entryMonth && data.entryMonth.id) {
				input.entryMonth = data.entryMonth.id;
			}
			if (data.adjustInd) {
				input.adjustInd = data.adjustInd;
			}
			if (data.adhocInd) {
				input.adhocInd = data.adhocInd;
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
