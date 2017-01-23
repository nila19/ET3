/** ** ./summary/summary.component.js *** */

(function(angular) {
	'use strict';

	angular.module('summary').component('summary', {
		templateUrl: 'summary/summary.htm',
		controller: SummaryController
	});

	SummaryController.$inject = ['summaryService', 'searchService', 'etmenuService', 'CONSTANTS',
			'$location'];
	function SummaryController(sms, ss, ms, C, $location) {
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

			// If menu is not loaded, load the default city.
			ms.checkInit();

			// Run default Summary.
			loadSummary();
		}

		function loadSummary() {
			sms.loadSummary();
		}

		function listExpenses(cat, mIdx) {
			ss.data.category.id = cat;
			ss.data.expMonth = vm.data.header[mIdx].mth;
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
			sms.loadDataForPage();
		}

		function nextPage() {
			sms.data.currPageNo += 1;
			sms.loadDataForPage();
		}
	}
})(window.angular);
