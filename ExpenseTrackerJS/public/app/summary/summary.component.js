/** ** ./summary/summary.component.js *** */

(function (angular) {
  'use strict';

  const SummaryController = function (sms, ss, ms, C, V, $location, $timeout) {
    const vm = this;
    const WAIT = 100; // milliseconds

		// ***** function declarations *****//
    const init = function () {
      vm.data = sms.data;
      ms.data.page = C.PAGES.SUMMARY;
      sms.data.columns = C.SIZES.SUMMARY_COL;
			// if menu is not loaded, load the default city.
      ms.checkInit();
			// run default Summary.
      initialLoad();
    };

    const initialLoad = function () {
      if (!V.data.city.id || ms.data.loading) {
        $timeout(function () {
          initialLoad();
        }, WAIT);
      } else {
        sms.data.months = V.data.transMonths;
        loadSummary();
      }
    };
    const loadSummary = function () {
      sms.loadSummary();
    };
    const listExpenses = function (category, idx) {
			// initialize
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
    };
    const hasPrevPage = function () {
      return sms.data.currPageNo > 0;
    };
    const hasNextPage = function () {
      return sms.data.currPageNo < sms.data.maxPageNo;
    };
    const prevPage = function () {
      sms.data.currPageNo -= 1;
      sms.loadCurrentPage();
    };
    const nextPage = function () {
      sms.data.currPageNo += 1;
      sms.loadCurrentPage();
    };

    // ***** exposed functions ******//
    vm.loadSummary = loadSummary;
    vm.hasPrevPage = hasPrevPage;
    vm.hasNextPage = hasNextPage;
    vm.prevPage = prevPage;
    vm.nextPage = nextPage;
    vm.listExpenses = listExpenses;

    init();
  };

  angular.module('summary').component('summary', {
    templateUrl: 'summary/summary.htm',
    controller: SummaryController
  });
  SummaryController.$inject = ['summaryService', 'searchService', 'etmenuService', 'CONSTANTS', 'VALUES', '$location',
    '$timeout'];
})(window.angular);
