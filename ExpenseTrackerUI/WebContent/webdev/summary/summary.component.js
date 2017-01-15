/** ** ./summary/summary.component.js *** */

(function(angular) {
	'use strict';

	angular.module('summary').component('summary', {
		templateUrl: 'summary/summary.htm',
		controller: SummaryController
	});

	SummaryController.$inject = ['summaryService', 'etmenuService', 'CONSTANTS', '$location'];
	function SummaryController(sms, ms, C, $location) {
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

			// Run default Summary.
			loadSummary();
		}

		function loadSummary() {
			sms.loadSummary();
		}

		function listExpenses(cat, mIdx, aggr) {
			if (!aggr) {
				// TODO Set via Services.
				var path = '/search/' + cat + '/' + vm.data.header[mIdx].mth;
				console.log('Navigating to :: ' + path);
				$location.path(path);
			}
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
