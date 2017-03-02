/** ** ./search/search.service.js *** */

(function(angular) {
	'use strict';

	angular.module('search').factory('searchService', searchService);

	searchService.$inject = ['dashboardService', 'explistService', 'etmenuService', 'ajaxService'];
	function searchService(ds, els, ms, aj) {
		var data = {
			thinList: true
		};

		var initializeData = function() {
			data.category = null;
			data.description = null;
			data.amount = null;
			data.account = null;
			data.bill = null;
			data.transMonth = null;
			data.entryMonth = null;
			data.adjustInd = null;
			data.adhocInd = null;
			data.thinList = true;
		};
		var addProp = function(input, dp, ip, ip2) {
			var prop = data[dp];
			if (prop && prop.id) {
				input[ip] = prop.id;
				if (ip2) {
					input[ip2] = prop.aggregate;
				}
			}
		};
		var buildSearchInput = function() {
			var input = {
				city: ms.data.menu.city.id,
				thinList: data.thinList
			};
			if (data.description && data.description !== '') {
				input.description = data.description;
			}
			if (data.amount && data.amount !== '' && data.amount !== 0) {
				input.amount = data.amount;
			}
			if (data.adjustInd) {
				input.adjustInd = data.adjustInd;
			}
			if (data.adhocInd) {
				input.adhocInd = data.adhocInd;
			}
			addProp(input, 'category', 'categoryId');
			addProp(input, 'account', 'accountId');
			addProp(input, 'bill', 'billId');
			addProp(input, 'transMonth', 'transMonth', 'transMonthAggr');
			addProp(input, 'entryMonth', 'entryMonth', 'entryMonthAggr');
			return input;
		};
		var loadResults = function(dt) {
			els.loadData(dt);
			els.data.thinList = data.thinList;
			ds.data.loading.donestep = 3;
		};
		var doSearch = function() {
			els.data.loading = true;
			var input = buildSearchInput();

			// If at least one criteria (excluding city, thinList), set 'Filter applied' flag.
			els.data.filterApplied = (Object.keys(input).length > 2) ? true : false;

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
