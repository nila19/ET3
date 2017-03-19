/** ** ./search/search.component.js *** */

(function (angular) {
  'use strict';

  const SearchController = function (ss, ms, sus, els, us, C, V, $routeParams, $timeout) {
    const vm = this;
    const WAIT = 500; // milliseconds

		// ***** function declarations *****//
    const init = function () {
      vm.data = ss.data;
      vm.ta = V.data;

      ms.data.page = C.PAGES.SEARCH;
      els.data.rowCount = C.SIZES.SEARCH_ROW;
      els.data.thinListToggle = true;
			// temporarily resize the EXPLIST to fit the page, until the search reloads the list.
      els.data.currPageNo = 0;
      els.loadCurrentPage();

			// if menu is not loaded, load the default city from V.
      ms.checkInit();

			// don't initialize if sent from Summary page.
      if (!$routeParams.drill) {
        ss.initializeData();
      }
      initSearch();
    };
    const initSearch = function () {
      if (!V.data.city.id || ms.data.loading) {
        $timeout(function () {
          initSearch();
        }, WAIT);
      } else {
        ss.doSearch();
      }
    };
    const doSearch = function () {
      ss.doSearch();
    };

    // ***** exposed functions ******//
    vm.doSearch = doSearch;

    init();
  };

  angular.module('search').component('search', {
    templateUrl: 'search/search.htm',
    controller: SearchController
  });
  SearchController.$inject = ['searchService', 'etmenuService', 'startupService', 'explistService', 'utilsService',
    'CONSTANTS', 'VALUES', '$routeParams', '$timeout'];
})(window.angular);
