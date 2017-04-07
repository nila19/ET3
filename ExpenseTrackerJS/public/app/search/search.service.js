/** ** ./search/search.service.js *** */

(function (angular) {
  'use strict';

  const searchService = function (ds, els, ms, aj) {
    const data = {
      thinList: true
    };

    const initializeData = function () {
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
    const addProp = function (input, dp, ip, ip2) {
      const prop = data[dp];

      if (prop && prop.id) {
        input[ip] = prop.id;
        if (ip2) {
          input[ip2] = prop.aggregate;
        }
      }
    };
    const buildSearchInput = function () {
      const input = {
        cityId: ms.data.menu.city.id,
        thinList: data.thinList
      };

      if (data.description && data.description !== '') {
        input.description = data.description.name || data.description;
      }
      if (data.amount && data.amount !== '' && data.amount !== 0) {
        input.amount = data.amount;
      }
      if (data.adjustInd) {
        input.adjust = data.adjustInd;
      }
      if (data.adhocInd) {
        input.adhoc = data.adhocInd;
      }
      addProp(input, 'category', 'catId');
      addProp(input, 'account', 'acctId');
      addProp(input, 'bill', 'billId');
      addProp(input, 'transMonth', 'transMonth', 'transYear');
      addProp(input, 'entryMonth', 'entryMonth', 'entryYear');
      return input;
    };
    const loadResults = function (dt) {
      els.loadData(dt.data);
      els.data.thinList = data.thinList;
      ds.data.loading.donestep = 3;
    };
    const doSearch = function () {
      els.data.loading = true;
      const input = buildSearchInput();

			// if at least one criteria (excluding city, thinList), set 'Filter applied' flag.
      els.data.filterApplied = (Object.keys(input).length > 2) ? true : false;

      aj.query('/search/go', input, loadResults);
    };

    return {
      data: data,
      initializeData: initializeData,
      doSearch: doSearch,
      loadResults: loadResults
    };
  };

  angular.module('search').factory('searchService', searchService);
  searchService.$inject = ['dashboardService', 'explistService', 'etmenuService', 'ajaxService'];
})(window.angular);
