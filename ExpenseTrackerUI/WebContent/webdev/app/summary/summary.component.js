/** ** ./summary/summary.component.js *** */

(function(angular) {
	'use strict';

	angular.module('summary').component('summary', {
		templateUrl: 'summary/summary.htm',
		controller: SummaryController
	});

	SummaryController.$inject = ['summaryService', 'searchService', 'etmenuService', 'CONSTANTS',
			'VALUES', '$location', '$timeout'];
	function SummaryController(sms, ss, ms, C, V, $location, $timeout) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.loadSummary = loadSummary;
		vm.hasPrevPage = hasPrevPage;
		vm.hasNextPage = hasNextPage;
		vm.prevPage = prevPage;
		vm.nextPage = nextPage;
		vm.listExpenses = listExpenses;

		// ***** Function declarations *****//
		function init() {
			vm.data = sms.data;
			ms.data.page = C.PAGES.SUMMARY;
			sms.data.columns = C.SIZES.SUMMARY_COL;

			// If menu is not loaded, load the default city.
			ms.checkInit();

			// Run default Summary.
			initialLoad();
		}

		function initialLoad() {
			if (!V.data.city.id || ms.data.loading) {
				$timeout(function() {
					initialLoad();
				}, 500);
			} else {
				sms.data.months = V.data.transMonths;
				loadSummary();
			}
		}

		function loadSummary() {
			sms.loadSummary();
		}

		function listExpenses(category, idx) {
			// Initialize
			ss.initializeData();

			if (category.id > 0) {
				ss.data.category = category;
			}
			ss.data.transMonth = vm.data.months[idx];
			ss.data.adjustInd = 'N';
			if (!(sms.data.input.adhoc && sms.data.input.regular)) {
				ss.data.adhocInd = (sms.data.input.adhoc && !sms.data.input.regular) ? 'Y' : 'N';
			}
			$location.path('/search/Y');
		}

		function hasPrevPage() {
			return sms.data.currPageNo > 0;
		}

		function hasNextPage() {
			return sms.data.currPageNo < sms.data.maxPageNo;
		}

		function prevPage() {
			sms.data.currPageNo -= 1;
			sms.loadCurrentPage();
		}

		function nextPage() {
			sms.data.currPageNo += 1;
			sms.loadCurrentPage();
		}
	}
})(window.angular);
