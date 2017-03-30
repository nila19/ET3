/** ** ./app.route.js *** */

(function (angular) {
  'use strict';
  const appRoute = function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/dashboard', {
      template: '<dashboard></dashboard>'
    }).when('/summary', {
      template: '<summary></summary>'
    }).when('/search/:drill', {
      template: '<search></search>'
    }).when('/search', {
      template: '<search></search>'
    }).when('/startup', {
      template: '<startup></startup>'
    }).otherwise('/startup');
  };

  angular.module('app').config(appRoute);
  appRoute.$inject = ['$locationProvider', '$routeProvider'];
})(window.angular);

/** ** ./core/constants.js *** */
/* eslint no-magic-numbers: "off" */

(function (angular) {
  'use strict';

  angular.module('core').constant('CONSTANTS', {
    MSG: {
      INFO: 'info',
      SUCCESS: 'success',
      WARNING: 'warning',
      DANGER: 'danger'
    },
    SIZES: {
      SUMMARY_COL: 13, // # of months @ Summary
      CHART_COL: 12, // # of months @ Chart
      SEARCH_ROW: 13, // # of Expense @ Search
      DASHBOARD_ROW: 4, // # of Expense @ Dashboard
      BILLS_ROW: 2, // # of Bills @ Dashboard
      ACCTS_COL: 6, // # of Accounts in a row @ Dashboard
      PAGINATE_BTN: 5, // # of Pagination buttons for Bills & ExpList
    },
    AMOUNT_REGEXP: /^-?\d+(?:\.\d{2}){0,1}$/,
		// bASE_URL: 'http://localhost:8080/ExpenseTrackerWS/servlet',
    BASE_URL: '.',
    PAGES: {
      DASHBOARD: 'DASHBOARD',
      SUMMARY: 'SUMMARY',
      SEARCH: 'SEARCH'
    },
    HREF: {
      DASHBOARD: '/dashboard',
      SUMMARY: '/summary',
      SEARCH: '/search'
    },
    CURRENCY: {
      USD: 'USD',
      INR: 'INR'
    }
  });
})(window.angular);

/** ** ./core/values.js *** */

(function (angular) {
  'use strict';

  angular.module('core').value('VALUES', {
    data: {
      env: null,
      city: {},
      cities: [],
      categories: [],
      allCategories: [],
      descriptions: [],
      accounts: [],
      allAccounts: [],
      transMonths: [],
      entryMonths: [],
      bills: []
    }
  });
})(window.angular);

/** ** ./dashboard/dashboard.component.js *** */

(function (angular) {
  'use strict';

  const DashboardController = function (dws, dfs, ms, els, C, V, $timeout) {
    const WAIT = 100; // milliseconds

    const init = function () {
      ms.data.page = C.PAGES.DASHBOARD;
      els.data.rowCount = C.SIZES.DASHBOARD_ROW;

			// if Menu is not loaded yet; load the default city from V.
      ms.checkInit();

      dws.initialize();
      dfs.setFlags();
      loadPage();
    };
		// load default bills & expenses once menu is loaded.
    const loadPage = function () {
      if (!V.data.city.id || ms.data.loading) {
        $timeout(function () {
          loadPage();
        }, WAIT);
      } else {
        dws.loadPage();
      }
    };

    init();
  };

  angular.module('dashboard').component('dashboard', {
    templateUrl: 'dashboard/dashboard.htm',
    controller: DashboardController
  });
  DashboardController.$inject = ['dashboardwrapperService', 'dashboardFlagsService', 'etmenuService',
    'explistService', 'CONSTANTS', 'VALUES', '$timeout'];
})(window.angular);

/** ** ./dashboard/dashboard.service.js *** */

(function (angular) {
  'use strict';

  const dashboardFlagsService = function (ms, acs, as, cs, bs) {
    const setFlags = function () {
      acs.data.showAcctsRowOne = true;
      as.data.showAdd = true;
      bs.data.showBills = true;

      ms.data.showingMoreAccounts = false;
      acs.data.showAcctsMore = false;
      ms.data.showingChart = false;
      cs.data.showChart = false;
    };
    const toggleMoreAccounts = function () {
      ms.data.showingMoreAccounts = !ms.data.showingMoreAccounts;
      acs.data.showAcctsMore = !acs.data.showAcctsMore;
    };
    const toggleChart = function () {
      ms.data.showingChart = !ms.data.showingChart;
      as.data.showAdd = !as.data.showAdd;
      cs.data.showChart = !cs.data.showChart;
      cs.renderChart();
    };

    return {
      setFlags: setFlags,
      toggleMoreAccounts: toggleMoreAccounts,
      toggleChart: toggleChart
    };
  };

  angular.module('dashboard').factory('dashboardFlagsService', dashboardFlagsService);
  dashboardFlagsService.$inject = ['etmenuService', 'accountsService', 'addService', 'chartService', 'billsService'];
})(window.angular);

/** ** ./dashboard/dashboard.service.js *** */

(function (angular) {
  'use strict';

  const dashboardService = function () {
    const data = {
      loading: {
        on: false,
        donestep: 0
      }
    };

    return {
      data: data,
    };
  };

  angular.module('dashboard').factory('dashboardService', dashboardService);
  dashboardService.$inject = [];
})(window.angular);

/** ** ./dashboard/dashboardwrapper.service.js *** */

(function (angular) {
  'use strict';

  const dashboardwrapperService = function (ds, ms, acs, ss, els, elws, bs) {
    const loadComplete = function () {
			// don't wait for Step 4 to be complete... Reduces the page loading time.
      ms.data.loading = false;
      ds.data.loading.on = false;
    };
    const loadPage = function () {
      ms.data.loading = true;
      ds.data.loading.on = true;
      ds.data.loading.donestep = 0;
      acs.loadAllAccounts();
      bs.loadAllBills();
      elws.reloadExpenses();
      loadComplete();
    };
    const initialize = function () {
      els.data.thinList = true;
      els.data.thinListToggle = false;

			// temporarily resize the EXPLIST to fit the page, until the search reloads the list.
      els.data.currPageNo = 0;
      els.loadCurrentPage();
      ss.initializeData();

      acs.data.filterBy = null;
      bs.data.filterApplied = false;
      bs.data.filterBy = null;
    };

    return {
      loadPage: loadPage,
      initialize: initialize
    };
  };

  angular.module('dashboard').factory('dashboardwrapperService', dashboardwrapperService);
  dashboardwrapperService.$inject = ['dashboardService', 'etmenuService', 'accountsService', 'searchService',
    'explistService', 'explistwrapperService', 'billsService'];
})(window.angular);

/** ** ./etmenu/etmenu.component.js *** */

(function (angular) {
  'use strict';

  const ETMenuController = function (ms, dfs, sus, us, C, V, $location, $timeout, $route) {
    const vm = this;
    const WAIT = 500; // milliseconds

		// ***** function declarations *****//
    const init = function () {
      sus.loadAll();
      vm.data = ms.data;
      vm.data.href = C.HREF;

      ms.checkInit();
      ms.data.showButtons = (ms.data.page === C.PAGES.DASHBOARD);
    };
    const toggleMoreAccounts = function () {
      dfs.toggleMoreAccounts();
    };
    const toggleChart = function () {
      dfs.toggleChart();
    };
    const changeCity = function (id) {
      V.data.city = us.getObjectOf(ms.data.menu.cities, id);
      sus.loadOthers();
      $timeout(function () {
        checkReloadPage();
      }, WAIT);
    };
    const checkReloadPage = function () {
      if (!V.data.city.id || ms.data.loading) {
        $timeout(function () {
          checkReloadPage();
        }, WAIT);
      } else {
        $route.reload();
        $location.path(C.HREF[ms.data.page]);
      }
    };

    // ***** exposed functions ******//
    vm.toggleMoreAccounts = toggleMoreAccounts;
    vm.toggleChart = toggleChart;
    vm.changeCity = changeCity;

    init();
  };

  angular.module('etmenu').component('etmenu', {
    templateUrl: 'etmenu/etmenu.htm',
    controller: ETMenuController
  });
  ETMenuController.$inject = ['etmenuService', 'dashboardFlagsService', 'startupService', 'utilsService', 'CONSTANTS',
    'VALUES', '$location', '$timeout', '$route'];
})(window.angular);

/** ** ./etmenu/etmenu.service.js *** */

(function (angular) {
  'use strict';

  const etmenuService = function (C, V) {
    const data = {
      page: '',
      showButtons: false,
      showingMoreAccounts: false,
      showingChart: false,
      loading: false,
      menu: {
        city: {},
        cities: [],
        env: null
      },
      CURRENCY: C.CURRENCY
    };

    const loadCities = function () {
      data.menu = V.data;
    };
    const checkInit = function () {
      if (!data.menu || !data.menu.city || !data.menu.city.name) {
        loadCities();
      }
    };

    return {
      data: data,
      checkInit: checkInit
    };
  };

  angular.module('etmenu').factory('etmenuService', etmenuService);
  etmenuService.$inject = ['CONSTANTS', 'VALUES'];
})(window.angular);

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
        input.description = data.description;
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

/** ** ./startup/startup.component.js *** */

(function (angular) {
  'use strict';

  const StartupController = function (sus, ms, C, V, $location, $timeout) {
    const vm = this;
    const WAIT = 500; // milliseconds

    const init = function () {
      vm.data = sus.data;
      sus.loadAll();
      checkLoadComplete();
    };
    const checkLoadComplete = function () {
      if (!V.data.city.id || ms.data.loading) {
        $timeout(function () {
          checkLoadComplete();
        }, WAIT);
      } else {
        $location.path('/dashboard');
      }
    };

    init();
  };

  angular.module('startup').component('startup', {
    templateUrl: 'startup/startup.htm',
    controller: StartupController
  });
  StartupController.$inject = ['startupService', 'etmenuService', 'CONSTANTS', 'VALUES', '$location', '$timeout'];
})(window.angular);

/** ** ./startup/startup.service.js *** */

(function (angular) {
  'use strict';

  const startupService = function (ms, aj, C, V, $timeout) {
    const data = {
      status: 0,
      connect: false,
      loadInitiated: false
    };
    const TEN = 10;
    const TOTAL = 100;
    const wait = 10;  // milliseconds

    const checkLoadingComplete = function () {
      if (data.status >= TOTAL) {
        // console.log('@ StartupService: Loading startup components COMPLETED...');
        ms.data.loading = false;
      } else {
        $timeout(function () {
          checkLoadingComplete();
        }, wait);
      }
    };
    const loadEntryMonths = function (dt) {
      V.data.entryMonths = [];
      angular.forEach(dt.data, function (entryMonth) {
        V.data.entryMonths.push(entryMonth);
      });
      data.status += TEN;
    };
    const getEntryMonths = function (city) {
      aj.query('/startup/months/entry', {cityId: city.id}, loadEntryMonths);
    };
    const loadTransMonths = function (dt) {
      V.data.transMonths = [];
      angular.forEach(dt.data, function (transMonth) {
        V.data.transMonths.push(transMonth);
      });
      data.status += TEN;
    };
    const getTransMonths = function (city) {
      aj.query('/startup/months/trans', {cityId: city.id}, loadTransMonths);
    };
    const loadInactiveAccounts = function (dt) {
      angular.forEach(dt.data, function (ac) {
        V.data.allAccounts.push(ac);
      });
      data.status += TEN;
    };
    const getInactiveAccounts = function (city) {
      aj.query('/startup/accounts/inactive', {cityId: city.id}, loadInactiveAccounts);
    };
    const loadAccounts = function (dt) {
      V.data.accounts = [];
      V.data.allAccounts = [];
      angular.forEach(dt.data, function (ac) {
        V.data.accounts.push(ac);
        V.data.allAccounts.push(ac);
      });
      data.status += TEN;
    };
    const getAccounts = function (city) {
      aj.query('/startup/accounts', {cityId: city.id}, loadAccounts);
    };
    const loadDescriptions = function (dt) {
      V.data.descriptions = dt.data;
      data.status += TEN;
    };
    const getDescriptions = function (city) {
      aj.query('/startup/descriptions', {cityId: city.id}, loadDescriptions);
    };
    const loadAllCategories = function (dt) {
      V.data.allCategories = dt.data;
      data.status += TEN;
    };
    const getAllCategories = function (city) {
      aj.query('/startup/categories/all', {cityId: city.id}, loadAllCategories);
    };
    const loadCategories = function (dt) {
      V.data.categories = dt.data;
      data.status += TEN;
    };
    const getCategories = function (city) {
      aj.query('/startup/categories', {cityId: city.id}, loadCategories);
    };
    const loadCities = function (dt) {
      V.data.cities = dt.data;
      data.status += TEN;
    };
    const getCities = function () {
      aj.query('/startup/cities', {}, loadCities);
    };
    const loadDefaultCity = function (dt) {
      V.data.city = dt.data;
      data.status += TEN;
      loadAllForCity();
    };
    const getDefaultCity = function () {
      aj.get('/startup/city/default', {}, loadDefaultCity);
    };
    const loadConnect = function (dt) {
      // if resp code is 0.
      data.connect = (dt.code === 0);
      if (data.connect) {
        V.data.env = dt.data.env;
        data.status += TEN;
        getDefaultCity();
        getCities();
      }
    };
    const connect = function () {
      aj.get('/startup/connect', {}, loadConnect);
    };
    const loadAll = function () {
      if (!data.loadInitiated) {
        ms.data.loading = true;
        data.loadInitiated = true;
        // console.log('@ StartupService: Loading startup components...');
        connect();
      }
    };
    const loadAllForCity = function () {
      getCategories(V.data.city);
      getAllCategories(V.data.city);
      getDescriptions(V.data.city);
      getAccounts(V.data.city);
      getInactiveAccounts(V.data.city);
      getTransMonths(V.data.city);
      getEntryMonths(V.data.city);
      checkLoadingComplete();
    };
    const loadOthers = function () {
      ms.data.loading = true;
      // console.log('@ StartupService: Loading items on city change...');
      loadAllForCity();
    };

    return {
      data: data,
      loadAll: loadAll,
      loadOthers: loadOthers,
    };
  };

  angular.module('startup').factory('startupService', startupService);
  startupService.$inject = ['etmenuService', 'ajaxService', 'CONSTANTS', 'VALUES', '$timeout'];
})(window.angular);

/** ** ./summary/summary.component.js *** */

(function (angular) {
  'use strict';

  const SummaryController = function (sms, ss, ms, C, V, $location, $timeout) {
    const vm = this;
    const WAIT = 500; // milliseconds

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

/** ** ./summary/summary.service.js *** */

(function (angular) {
  'use strict';

  const summaryService = function (ms, aj) {
    const data = {
      months: [],
      totalrow: {},
      rows: [],
      pgData: {},
      maxPageNo: 0,
      currPageNo: 0,
      columns: 0,
      input: {
        cityId: 0,
        forecast: false,
        adhoc: true,
        regular: true
      }
    };

    const loadCurrentPage = function () {
      const pg = data.currPageNo;
      const cols = data.columns;

      data.pgData.months = data.months.slice(pg * cols, (pg + 1) * cols);
      data.pgData.totalrow = data.totalrow.amount.slice(pg * cols, (pg + 1) * cols);

      const pgRows = [];

      data.rows.forEach(function (row) {
        const pgRow = {};

        pgRow.category = row.category;
        pgRow.amount = row.amount.slice(pg * cols, (pg + 1) * cols);
        pgRow.count = row.count.slice(pg * cols, (pg + 1) * cols);
        pgRows.push(pgRow);
      });
      data.pgData.rows = pgRows;
    };
    const loadData = function (dt) {
      data.totalrow = dt.data.splice(0, 1)[0];
      data.rows = dt.data;
      data.maxPageNo = Math.ceil(data.months.length / data.columns) - 1;
      data.currPageNo = 0;
      loadCurrentPage();
      ms.data.loading = false;
    };
    const loadSummary = function () {
      ms.data.loading = true;
      data.input.cityId = ms.data.menu.city.id;
      aj.query('/summary/go', data.input, loadData);
    };

    return {
      data: data,
      loadSummary: loadSummary,
      loadCurrentPage: loadCurrentPage
    };
  };

  angular.module('summary').factory('summaryService', summaryService);
  summaryService.$inject = ['etmenuService', 'ajaxService'];
})(window.angular);

/** ** ./core/directives/xx-tooltip.directive.js *** */

(function (angular) {
  'use strict';

  const tooltip = function () {
    // const tooltip = function (scope, element, $attrs, ctrl) {
    const tooltip = function (scope, element) {
      $(element).hover(function () {
        $(element).tooltip('show');
      }, function () {
        $(element).tooltip('hide');
      });
    };

    return {
      restrict: 'A',
      link: tooltip
    };
  };

  angular.module('core.directives').directive('tooltip', tooltip);
})(window.angular);

/** ** ./core/directives/xx-amount.directive.js *** */

(function (angular) {
  'use strict';

  const xxAmount = function (CONSTANTS, $filter) {
    const amount = function ($scope, $element, $attrs, ctrl) {
			// validator
      ctrl.$validators.xxAmount = function (mv, vv) {
        if (ctrl.$isEmpty(mv) || CONSTANTS.AMOUNT_REGEXP.test(vv)) {
          return true;
        }
        return false;
      };
			// formatter - formats number to currency using inbuilt formatter.
      const formatter = function () {
        const value = $element.val().replace(/[^-.\d]/g, '');

        ctrl.$viewValue = value;
        $element.val($filter('currency')(value));
      };
      const trimmer = function () {
        $element.val(ctrl.$viewValue);
      };

			// extracts digits out of the input & store in model. Defaults to 0.
      ctrl.$parsers.push(function (viewValue) {
        return viewValue.replace(/[^-.\d]/g, '');
      });
			// runs when model gets updated on the scope directly; Keeps view in sync
      ctrl.$render = function () {
        $element.val($filter('currency')(ctrl.$viewValue));
      };
			// gets triggered during onChange event in the
      $element.bind('focus', trimmer);
			// gets triggered during onChange event in the
      $element.bind('focusout', formatter);
    };

    return {
      require: 'ngModel',
      link: amount
    };
  };

  angular.module('core.directives').directive('xxAmount', xxAmount);
  xxAmount.$inject = ['CONSTANTS', '$filter'];
})(window.angular);

/** ** ./core/directives/xx-date.directive.js *** */

(function (angular) {
  'use strict';

  const xxDate = function (CONSTANTS, $filter) {
    const date = function ($scope, $element, $attrs, ctrl) {
			// runs when model gets updated on the scope directly; Keeps view in sync
      ctrl.$render = function () {
        $element.val($filter('date')(ctrl.$viewValue, 'dd-MMM-yyyy'));
      };
    };

    return {
      require: 'ngModel',
      link: date
    };
  };

  angular.module('core.directives').directive('xxDate', xxDate);
  xxDate.$inject = ['CONSTANTS', '$filter'];
})(window.angular);

/** ** ./core/services/ajax.service.js *** */

(function (angular) {
  'use strict';

  const ajaxService = function (us, C, $resource) {
    const url = function (path) {
      const url = C.BASE_URL + path;

      return $resource(url);
    };
    const get = function (path, data, ok) {
      url(path).get(data, ok, error);
    };
    const query = function (path, data, ok) {
      url(path).get(data, ok, error);
      // url(path).query(data, ok, error);
    };
    const post = function (path, data, ok) {
      url(path).save(data, ok, error);
    };
    const error = function (resp) {
      // console.log(resp);
      us.show('AJAX Error!!.. ' + resp.status + ' :: ' + resp.statusText, C.MSG.DANGER);
    };

    return {
      url: url,
      get: get,
      query: query,
      post: post
    };
  };

  angular.module('core.services').factory('ajaxService', ajaxService);
  ajaxService.$inject = ['utilsService', 'CONSTANTS', '$resource'];
})(window.angular);

/** ** ./core/services/utils.service.js *** */

(function (angular) {
  'use strict';

  const utilsService = function (C) {
    const DELAY = 2000; // milliseconds
    const getObjectOf = function (arr, id) {
      const o = {o: null, i: 0};

      for (o.i = 0; o.i < arr.length; o.i++) {
        if (arr[o.i].id === Number(id)) {
          o.o = arr[o.i];
          break;
        }
      }
      return o.o;
    };
    const getIndexOf = function (arr, id) {
      const i = {idx: null, i: 0};

      for (i.i = 0; i.i < arr.length; i.i++) {
        if (arr[i.i].id === Number(id)) {
          i.idx = i.i;
          break;
        }
      }
      return i.idx;
    };
		// popup message
    const showMsg = function (action, code) {
      const msg = '<b>' + action + '</b> - ' + (code === 0 ? 'Completed successfully.' : 'Failed.');
      const type = code === 0 ? C.MSG.SUCCESS : C.MSG.DANGER;

      show(msg, type);
    };
    const show = function (msg, t) {
      $.notify({
        icon: 'notifications',
        message: msg
      }, {
        type: t,
        delay: DELAY,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
    };

    return {
      getObjectOf: getObjectOf,
      getIndexOf: getIndexOf,
      showMsg: showMsg,
      show: show
    };
  };

  angular.module('core.services').factory('utilsService', utilsService);
  utilsService.$inject = ['CONSTANTS'];
})(window.angular);

/** ** ./dashboard/accounts/accounts.component.js *** */

(function (angular) {
  'use strict';

  const AccountsController = function (acs, ds, bs, elws) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = acs.data;
    };
    const filterAccount = function (id) {
			// if same account is already selected, do nothing.
      if (acs.data.filterBy !== id) {
        acs.filterAccount(id);
        elws.reloadExpenses();
      }
    };
    const tallyAccount = function (id) {
      acs.tallyAccount(id);
    };
    const isTallyToday = function (tallyDt) {
      return moment().isSame(moment(tallyDt), 'day');
    };

		// ***** exposed functions ******//
    vm.filterAccount = filterAccount;
    vm.tallyAccount = tallyAccount;
    vm.isTallyToday = isTallyToday;

    init();
  };

  angular.module('dashboard.accounts').component('accounts', {
    templateUrl: 'dashboard/accounts/accounts.htm',
    controller: AccountsController
  });
  AccountsController.$inject = ['accountsService', 'dashboardService', 'billsService', 'explistwrapperService'];
})(window.angular);

/** ** ./dashboard/accounts/accounts.service.js *** */

(function (angular) {
  'use strict';

  const accountsService = function (ms, ds, bs, els, ss, us, aj, C) {
    const data = {
      accts: null,
      rows: [],
      maxRows: 0,
      showAcctsRowOne: false,
      showAcctsMore: false,
      filterBy: null,
      tallyOn: null
    };
    const cols = C.SIZES.ACCTS_COL;

    const buildRows = function () {
      const i = {i: 0};

      data.rows = [];
      for (i.i = 0; i.i < data.maxRows; i.i++) {
        const row = {idx: i.i};

        row.cols = data.accts.slice(i.i * cols, (i.i + 1) * cols);
        data.rows.push(row);
      }
    };
    const loadData = function (dt) {
      ds.data.loading.donestep = 1;
      data.accts = dt.data;
      data.maxRows = Math.ceil(data.accts.length / cols);
      buildRows();
    };
    const loadAllAccounts = function () {
      const input = {cityId: ms.data.menu.city.id};

      aj.query('/startup/accounts', input, loadData);
    };
    const loadAccount = function (dt) {
      data.accts[us.getIndexOf(data.accts, dt.data.id)] = dt.data;
      buildRows();
      ms.data.loading = false;
    };
    const refreshAccount = function (id) {
      ms.data.loading = true;
      aj.get('/dashboard/account/' + id, {}, loadAccount);
    };
    const loadTally = function (dt) {
      ms.data.loading = false;
      us.showMsg('Tally', dt.code);
      if(dt.code === 0) {
        refreshAccount(data.tallyOn);
        ss.doSearch();
      }
    };
    const tallyAccount = function (id) {
      ms.data.loading = true;
      data.tallyOn = id;
      aj.post('/edit/tally/' + id, {}, loadTally);
    };
    const filterAccount = function (id) {
      data.filterBy = id;
      bs.clearBillsList();
      bs.loadBillsForAcct(id);
      ss.data.account = {
        id: id
      };
      ss.data.bill = null;
			// search will be triggered from ctrl.
    };

    return {
      data: data,
      loadAllAccounts: loadAllAccounts,
      tallyAccount: tallyAccount,
      filterAccount: filterAccount,
      refreshAccount: refreshAccount
    };
  };

  angular.module('dashboard.accounts').factory('accountsService', accountsService);
  accountsService.$inject = ['etmenuService', 'dashboardService', 'billsService', 'explistService', 'searchService',
    'utilsService', 'ajaxService', 'CONSTANTS'];
})(window.angular);

/** ** ./dashboard/add/add.component.js *** */

(function (angular) {
  'use strict';

  const AddController = function (as, els, us, V, C) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = as.data;
      vm.ta = V.data;
    };
    const isNull = function (e) {
      return !e || !e.id;
    };
    const id = function (e) {
      return (e && e.id) ? e.id : 0;
    };
    const addExpense = function (form) {
      if (form.$valid) {
        if (as.data.expense.adjust) {
          const accts = as.data.expense.accounts;

          if(isNull(accts.from) && isNull(accts.to)) {
            us.show('Select at least one of From, To accounts!!', C.MSG.WARNING);
            return false;
          } else if(id(accts.from) && id(accts.to) && (id(accts.from) === id(accts.to))) {
            us.show('From & To accounts cannot be the same!!', C.MSG.WARNING);
            return false;
          }
        }
        as.addExpense();
      }
    };

    // ***** exposed functions ******//
    vm.addExpense = addExpense;

    init();
  };

  angular.module('dashboard.add').component('add', {
    templateUrl: 'dashboard/add/add.htm',
    controller: AddController
  });
  AddController.$inject = ['addService', 'explistService', 'utilsService', 'VALUES', 'CONSTANTS'];
})(window.angular);

/** ** ./dashboard/add/add.service.js *** */

(function (angular) {
  'use strict';

  const addService = function (ms, acs, elws, aj, us) {
    const data = {
      showAdd: false,
      expense: {
        city: null,
        adjust: false,
        adhoc: false,
        category: null,
        accounts: {
          from: null,
          to: null
        },
        description: '',
        amount: '',
        transDt: ''
      }
    };

    const initForm = function () {
      data.expense.amount = '';
      data.expense.description = '';
    };
    const loadData = function (dt) {
      initForm();
      us.showMsg('Add Expense', dt.code);
      if(dt.code === 0) {
        // add the newly added Expense to the top of the Expenselist..
        elws.addItem(dt.data.id);
        if (data.expense.accounts.from && data.expense.accounts.from.id) {
          acs.refreshAccount(data.expense.accounts.from.id);
        }
        if (data.expense.accounts.to && data.expense.accounts.to.id) {
          acs.refreshAccount(data.expense.accounts.to.id);
        }
      }
    };
    const addExpense = function () {
      data.expense.city = ms.data.menu.city;
      aj.post('/edit/add', data.expense, loadData);
    };

    return {
      data: data,
      addExpense: addExpense
    };
  };

  angular.module('dashboard.add').factory('addService', addService);
  addService.$inject = ['etmenuService', 'accountsService', 'explistwrapperService', 'ajaxService', 'utilsService'];
})(window.angular);

/** ** ./dashboard/billpay/billpay.component.js *** */

(function (angular) {
  'use strict';

  const BillPayController = function (bps, bs, V) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = bps.data;
      vm.ta = V.data;
    };
    const payBill = function (form) {
      if (form.$valid) {
        bs.data.loading = true;
        bps.payBill();
        $('#model_BillPay').modal('hide');
      }
    };

    // ***** exposed functions ******//
    vm.payBill = payBill;

    init();
  };

  angular.module('dashboard.billpay').component('billpay', {
    templateUrl: 'dashboard/billpay/billpay.htm',
    controller: BillPayController
  });
  BillPayController.$inject = ['billpayService', 'billsService', 'VALUES'];
})(window.angular);

/** ** ./dashboard/billpay/billpay.service.js *** */

(function (angular) {
  'use strict';

  const billpayService = function (ms, bs, acs, elws, aj, us) {
    const data = {
      bill: null,
      city: null,
      account: '',
      paidDt: ''
    };

    const initForm = function () {
      data.account = '';
      data.paidDt = '';
      data.bill.balance = _.round(data.bill.balance, 2);
      data.bill.amount = _.round(data.bill.amount, 2);
    };
    const loadData = function (dt) {
      data.bill = dt;
      initForm();
    };
    const loadPayBill = function (dt) {
      us.showMsg('Bill Pay', dt.code);
      bs.data.loading = false;
      if(dt.code === 0) {
			// add the newly added Expense to the top of the Expenselist..
        elws.addItem(dt.data.id);

      // refresh accounts & bill
        bs.refreshBill(data.bill.id);
        acs.refreshAccount(data.bill.account.id);
        acs.refreshAccount(data.account.id);
      }
    };
    const payBill = function () {
      data.city = ms.data.menu.city;
      aj.post('/edit/paybill', data, loadPayBill);
    };

    return {
      data: data,
      loadData: loadData,
      payBill: payBill
    };
  };

  angular.module('dashboard.billpay').factory('billpayService', billpayService);
  billpayService.$inject = ['etmenuService', 'billsService', 'accountsService', 'explistwrapperService', 'ajaxService',
    'utilsService'];
})(window.angular);

/** ** ./dashboard/bills/bills.component.js *** */

(function (angular) {
  'use strict';

  const BillsController = function (bws, bs, acs, elws, els, ss) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = bs.data;
    };
    const hasPrevPageSet = function () {
      return bs.data.currPageSet > 0;
    };
    const hasNextPageSet= function () {
      return ((bs.data.currPageSet + 1) * bs.data.pageSetSize) <= bs.data.maxPageNo;
    };
    const prevPageSet = function () {
      bs.data.currPageSet -= 1;
    };
    const nextPageSet= function () {
      bs.data.currPageSet += 1;
    };
		// idx will be 0,1,2,3,4
    const page = function (idx) {
      return (bs.data.currPageSet * bs.data.pageSetSize) + idx;
    };
    const loadPage= function (pg) {
      bs.data.currPageNo = pg;
      bs.loadCurrentPage();
    };
    const showBillPay = function (id) {
      bws.showBillPay(id);
      $('#model_BillPay').modal('show');
    };
    const filterExpenses = function (id) {
			// if same bill is already selected, do nothing.
      if (bs.data.filterBy !== id) {
        bs.data.filterBy = id;
        ss.data.bill = {
          id: id
        };
        elws.reloadExpenses();
      }
    };
    const clearFilter= function () {
      elws.clearFilter();
    };
    const showOpenBills = function () {
      bs.data.tab = 'OPEN';
      bs.buildRowsForTab();
    };
    const showClosedBills = function () {
      bs.data.tab = 'CLOSED';
      if (bs.data.closedBills == null) {
        if (acs.data.filterBy == null) {
          bs.loadAllBills();
        } else {
          bs.loadBillsForAcct(acs.data.filterBy);
        }
      } else {
        bs.buildRowsForTab();
      }
    };

    // ***** exposed functions ******//
    vm.hasPrevPageSet = hasPrevPageSet;
    vm.hasNextPageSet = hasNextPageSet;
    vm.prevPageSet = prevPageSet;
    vm.nextPageSet = nextPageSet;
    vm.page = page;
    vm.loadPage = loadPage;
    vm.showBillPay = showBillPay;
    vm.filterExpenses = filterExpenses;
    vm.clearFilter = clearFilter;
    vm.showOpenBills = showOpenBills;
    vm.showClosedBills = showClosedBills;

    init();
  };

  angular.module('dashboard.bills').component('bills', {
    templateUrl: 'dashboard/bills/bills.htm',
    controller: BillsController
  });
  BillsController.$inject = ['billswrapperService', 'billsService', 'accountsService', 'explistwrapperService',
    'explistService', 'searchService'];
})(window.angular);

/** ** ./dashboard/bills/bills.service.js *** */

(function (angular) {
  'use strict';

  const billsService = function (ms, ds, aj, us, C) {
    const data = {
      showBills: false,
      rows: [],
      pgData: {},
      currPageSet: 0,
      currPageNo: 0,
      maxPageNo: 0,
      pageSetSize: C.SIZES.PAGINATE_BTN,
      tab: 'OPEN',
      openBills: [],
      closedBills: null,
      filterApplied: false,
      filterBy: null,
      loading: false
    };
    const rows = C.SIZES.BILLS_ROW;

    const clearBillsList = function () {
      data.openBills = null;
      data.closedBills = null;
      data.tab = 'OPEN';
    };
    const loadCurrentPage = function () {
      const pg = data.currPageNo;

      data.pgData.rows = data.rows.slice(pg * rows, (pg + 1) * rows);
    };
    const loadBill = function (dt) {
      const idx = us.getIndexOf(data.rows, dt.data.id);

      data.rows[idx] = dt.data;
      loadCurrentPage();
      data.loading = false;
    };
    const refreshBill = function (id) {
      data.loading = true;
      aj.get('/dashboard/bill/' + id, {}, loadBill);
    };
    const buildRowsForTab = function () {
      data.rows = data.tab === 'OPEN' ? data.openBills : data.closedBills;
      data.maxPageNo = Math.ceil(data.rows.length / rows) - 1;
      data.currPageSet = 0;
      data.currPageNo = 0;
      loadCurrentPage();
      data.loading = false;
    };
    const loadData = function (dt) {
      ds.data.loading.donestep = 2;
      if (data.tab === 'OPEN') {
        data.openBills = dt.data;
      } else {
        data.closedBills = dt.data;
      }
      buildRowsForTab();
    };
    const loadBillsForAcct = function (id) {
      data.loading = true;
      data.filterApplied = true;
      const input = {
        cityId: ms.data.menu.city.id,
        acctId: id,
        paidInd: (data.tab === 'OPEN') ? 'N' : 'Y'
      };

      aj.query('/dashboard/bills', input, loadData);
    };
    const loadAllBills = function () {
      data.loading = true;
      data.filterApplied = false;
      const input = {
        cityId: ms.data.menu.city.id,
        paidInd: (data.tab === 'OPEN') ? 'N' : 'Y'
      };

      aj.query('/dashboard/bills', input, loadData);
    };

    return {
      data: data,
      clearBillsList: clearBillsList,
      loadData: loadData,
      buildRowsForTab: buildRowsForTab,
      loadCurrentPage: loadCurrentPage,
      loadBillsForAcct: loadBillsForAcct,
      loadAllBills: loadAllBills,
      refreshBill: refreshBill
    };
  };

  angular.module('dashboard.bills').factory('billsService', billsService);
  billsService.$inject = ['etmenuService', 'dashboardService', 'ajaxService', 'utilsService', 'CONSTANTS'];
})(window.angular);

/** ** ./dashboard/bills/billswrapper.service.js *** */

(function (angular) {
  'use strict';

  const billswrapperService = function (bs, bps, us) {
    const showBillPay = function (id) {
      const bill = us.getObjectOf(bs.data.rows, id);

      bps.loadData(bill);
    };

    return {
      showBillPay: showBillPay
    };
  };

  angular.module('dashboard.bills').factory('billswrapperService', billswrapperService);
  billswrapperService.$inject = ['billsService', 'billpayService', 'utilsService'];
})(window.angular);

/** ** ./dashboard/chart/chart.component.js *** */

(function (angular) {
  'use strict';

  const ChartController = function (cs) {
    const vm = this;

    const init = function () {
      vm.data = cs.data;
    };

    init();
  };

  angular.module('dashboard.chart').component('chart', {
    templateUrl: 'dashboard/chart/chart.htm',
    controller: ChartController
  });
  ChartController.$inject = ['chartService'];
})(window.angular);

/** ** ./dashboard/chart/chart.service.js *** */
/* eslint new-cap: ["error", { "capIsNewExceptions": ["Bar"] }], no-magic-numbers: 'off'*/

(function (angular) {
  'use strict';

  const chartService = function (ms, ds, aj, C) {
    const data = {
      showChart: false,
      loaded: false,
      labels: [],
      series: [],
      data: [],
      ds: [],
      options: {},
      cols: C.SIZES.CHART_COL
    };

    const buildDataSet = function () {
      data.options = {
        scales: {
          yAxes: [{
            ticks: {
              max: 5000
            }
          }]
        }
      };
      data.ds = [{
        label: 'Regular',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        type: 'bar'
      }, {
        label: 'Adhoc',
        backgroundColor: 'rgba(255,99,132, 0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        type: 'bar'
      }, {
        label: 'Total',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        type: 'line'
      }];
    };
    const loadChartData = function (dt) {
      // take only the data of the last 12 months for the chart.
      data.labels = dt.data.labels.slice(0, data.cols);
      data.series = ['Regular', 'Adhoc', 'Total'];
      data.data[0] = dt.data.regulars.slice(0, data.cols);
      data.data[1] = dt.data.adhocs.slice(0, data.cols);
      data.data[2] = dt.data.totals.slice(0, data.cols);
			// chartOptions.high = Math.max.apply(null, data.series[0]);

      buildDataSet();
      data.loaded = true;
      ds.data.loading.donestep = 4;
    };
    const getChartData = function () {
      aj.get('/summary/chart', {
        cityId: ms.data.menu.city.id
      }, loadChartData);
    };
    const renderChart = function () {
      if (!data.loaded) {
        getChartData();
      }
    };

    return {
      data: data,
      renderChart: renderChart,
    };
  };

  angular.module('dashboard.chart').factory('chartService', chartService);
  chartService.$inject = ['etmenuService', 'dashboardService', 'ajaxService', 'CONSTANTS'];
})(window.angular);

/** ** ./dashboard/edit/edit.component.js *** */

(function (angular) {
  'use strict';

  const EditController = function (es, els, us, V, C) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = es.data;
      vm.ta = V.data;
    };
    const modifyExpense = function (form) {
      if (form.$valid) {
        const accts = es.data.expense.accounts;

        // clear bill if it does not belong to the same from account.
        if(accts.from.id && es.data.expense.bill) {
          if(accts.from.id !== es.data.expense.bill.account.id) {
            delete es.data.expense.bill;
          }
        }

        if (es.data.expense.adjust) {
          if(isNull(accts.from) && isNull(accts.to)) {
            us.show('1 - Mandatory fields are empty!!', C.MSG.WARNING);
            return false;
          }
          if(id(accts.from) && id(accts.to) && (id(accts.from) === id(accts.to))) {
            us.show('4 - From & To accounts cannot be the same!!', C.MSG.WARNING);
            return false;
          }
        } else {
          if (isNull(accts.from) || isNull(es.data.expense.category)) {
            us.show('2 - Mandatory fields are empty!!', C.MSG.WARNING);
            return false;
          }
          if (accts.from.billed && isNull(es.data.expense.bill)) {
            us.show('3 - Mandatory fields are empty!!', C.MSG.WARNING);
            return false;
          }
        }
        es.modifyExpense();
      }
    };
    const isNull = function (e) {
      return !e || !e.id;
    };
    const id = function (e) {
      return (e && e.id) ? e.id : 0;
    };
    const loadBills = function () {
      if (!isNull(es.data.expense.accounts.from) && es.data.expense.accounts.from.billed) {
        es.loadBills();
      }
    };
    const clearBills = function () {
      V.data.bills = [];
    };
    const deleteExpense = function () {
      es.deleteExpense();
    };

    // ***** exposed functions ******//
    vm.modifyExpense = modifyExpense;
    vm.deleteExpense = deleteExpense;
    vm.loadBills = loadBills;
    vm.clearBills = clearBills;

    init();
  };

  angular.module('dashboard.edit').component('edit', {
    templateUrl: 'dashboard/edit/edit.htm',
    controller: EditController
  });
  EditController.$inject = ['editService', 'explistService', 'utilsService', 'VALUES', 'CONSTANTS'];
})(window.angular);

/** ** ./dashboard/edit/edit.service.js *** */

(function (angular) {
  'use strict';

  const editService = function (ms, elws, acs, bs, aj, us, V) {
    const data = {
      expense: {},
      toRefresh: {
        accts: {},
        bills: {}
      },
      loading: false
    };

    const initRefresh = function () {
      data.toRefresh.accts = {};
      data.toRefresh.bills = {};
    };

    // store the account ids to be refreshed after modify/delete.
    const loadRefresh = function () {
      data.toRefresh.accts[data.expense.accounts.from.id] = data.expense.accounts.from.id;
      data.toRefresh.accts[data.expense.accounts.to.id] = data.expense.accounts.to.id;
      if(data.expense.bill && data.expense.bill.id) {
        data.toRefresh.bills[data.expense.bill.id] = data.expense.bill.id;
      }
    };

    // refresh all impacted accounts & bills after modify/delete.
    const refreshAll = function () {
      angular.forEach(data.toRefresh.accts, function (value, id) {
        if(id) {
          acs.refreshAccount(id);
        }
      });
      angular.forEach(data.toRefresh.bills, function (value, id) {
        bs.refreshBill(id);
      });
      initRefresh();
    };

		// load Bills
    const loadBillData = function (dt) {
      V.data.bills = dt.data;
    };
    const loadBills = function () {
      const input = {acctId: data.expense.accounts.from.id};

      aj.query('/dashboard/bills', input, loadBillData);
    };

		// load Page Data
    const loadData = function (dt) {
      initRefresh();
      data.expense = dt;
      data.expense.amount = _.round(data.expense.amount, 2);
      // refresh the 'from' account from TA so that it will have 'billed' attribute.
      if(data.expense.accounts.from.id) {
        data.expense.accounts.from = us.getObjectOf(V.data.accounts, data.expense.accounts.from.id);
      }
      // store the account ids, bill id to be refreshed after modify/delete.
      loadRefresh();
			// initialize Bills TA.
      if (data.expense.accounts.from.billed) {
        loadBills();
      }
    };

		// modify Expense
    const loadModifyData = function (dt) {
      data.loading = false;
      us.showMsg('Modify Expense', dt.code);
      if(dt.code === 0) {
        elws.modifyItem(data.expense.id);
        refreshAll();
      }
      $('#model_Modify').modal('hide');
    };
    const modifyExpense = function () {
      // re-store the account ids, bill id (if these are modified) to be refreshed after save.
      loadRefresh();
      aj.post('/edit/modify', data.expense, loadModifyData);
      data.loading = true;
    };

		// delete Expense
    const loadDeleteData = function (dt) {
      data.loading = false;
      us.showMsg('Delete Expense', dt.code);
      if(dt.code === 0) {
        elws.deleteItem(data.expense.id);
        refreshAll();
      }
      $('#model_Delete').modal('hide');
    };
    const deleteExpense = function () {
      aj.post('/edit/delete/' + data.expense.id, {},
					loadDeleteData);
      data.loading = true;
    };

    return {
      data: data,
      loadData: loadData,
      modifyExpense: modifyExpense,
      deleteExpense: deleteExpense,
      loadBills: loadBills
    };
  };

  angular.module('dashboard.edit').factory('editService', editService);
  editService.$inject = ['etmenuService', 'explistwrapperService', 'accountsService', 'billsService', 'ajaxService',
    'utilsService', 'VALUES'];
})(window.angular);

/** ** ./dashboard/explist/explist.component.js *** */

(function (angular) {
  'use strict';

  const ExplistController = function (elws, els, es, us) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = els.data;
    };
    const hasPrevPageSet = function () {
      return els.data.currPageSet > 0;
    };
    const hasNextPageSet = function () {
      return ((els.data.currPageSet + 1) * els.data.pageSetSize) <= els.data.maxPageNo;
    };
    const prevPageSet = function () {
      els.data.currPageSet -= 1;
    };
    const nextPageSet = function () {
      els.data.currPageSet += 1;
    };
		// idx will be 0,1,2,3,4
    const page = function (idx) {
      return (els.data.currPageSet * els.data.pageSetSize) + idx;
    };
    const loadPage = function (pg) {
      els.data.currPageNo = pg;
      els.loadCurrentPage();
    };
    const showModifyExpense = function (id) {
      editExpense(id);
      $('#model_Modify').modal('show');
    };
    const showDeleteExpense = function (id) {
      editExpense(id);
      $('#model_Delete').modal('show');
    };
    const editExpense = function (id) {
			// no need to fetch from DB. Fetch from local, clone & show in popup.
      const trans = $.extend({}, us.getObjectOf(els.data.rows, id));

      es.loadData(trans);
    };
    const swapExpense = function (id, diff) {
      const idx = us.getIndexOf(els.data.rows, id);

      elws.swapExpense(idx, idx + diff);
    };
    const clearFilter = function () {
      elws.clearFilter();
    };
    const toggleThinList = function () {
      if (els.data.thinListToggle) {
        els.data.thinList = !els.data.thinList;
        elws.reloadExpenses();
      }
    };

    // ***** exposed functions ******//
    vm.hasPrevPageSet = hasPrevPageSet;
    vm.hasNextPageSet = hasNextPageSet;
    vm.prevPageSet = prevPageSet;
    vm.nextPageSet = nextPageSet;
    vm.page = page;
    vm.loadPage = loadPage;
    vm.showModifyExpense = showModifyExpense;
    vm.showDeleteExpense = showDeleteExpense;
    vm.swapExpense = swapExpense;
    vm.clearFilter = clearFilter;
    vm.toggleThinList = toggleThinList;

    init();
  };

  angular.module('dashboard.explist').component('explist', {
    templateUrl: 'dashboard/explist/explist.htm',
    controller: ExplistController
  });
  ExplistController.$inject = ['explistwrapperService', 'explistService', 'editService', 'utilsService'];
})(window.angular);

/** ** ./dashboard/explist/explist.service.js *** */

(function (angular) {
  'use strict';

  const explistService = function (us, C) {
    const data = {
      pgData: {
        rows: []
      },
      maxPageNo: 0,
      currPageSet: 0,
      currPageNo: 0,
      rowCount: 1,
      pageSetSize: C.SIZES.PAGINATE_BTN,
      loading: false,
      filterApplied: false,
      thinList: true,
      thinListToggle: false,
      total: 0,
      rows: []
    };

    const calTotal = function () {
      data.total = 0;
      data.rows.forEach(function (row) {
        data.total += row.amount;
      });
    };
    const loadCurrentPage = function () {
      const pg = data.currPageNo;

      data.pgData.rows = data.rows.slice(pg * data.rowCount, (pg + 1) * data.rowCount);
    };
    const paginate = function () {
      data.maxPageNo = Math.ceil(data.rows.length / data.rowCount) - 1;
      calTotal();
      loadCurrentPage();
    };
    const loadData = function (dt) {
      data.rows = dt;
      data.currPageSet = 0;
      data.currPageNo = 0;
      data.loading = false;

      paginate();
    };
    const addItem = function (item) {
      data.rows.unshift(item);
      paginate();
    };
    const modifyItem = function (item) {
      const idx = us.getIndexOf(data.rows, item.id);

      data.rows[idx] = item;
      paginate();
    };
    const deleteItem = function (id) {
      data.rows.splice(us.getIndexOf(data.rows, id), 1);
      paginate();
    };

    return {
      data: data,
      loadData: loadData,
      paginate: paginate,
      loadCurrentPage: loadCurrentPage,
      addItem: addItem,
      modifyItem: modifyItem,
      deleteItem: deleteItem
    };
  };

  angular.module('dashboard.explist').factory('explistService', explistService);
  explistService.$inject = ['utilsService', 'CONSTANTS'];
})(window.angular);

/** ** ./dashboard/explist/explistwrapper.service.js *** */

(function (angular) {
  'use strict';

  const explistwrapperService = function (els, ms, ss, acs, bs, aj, us, C, $timeout) {
    const DELAY = 1000; // milliseconds
    const TEN = 10;
    const data = {
      swapPool: [],
      tempPool: [],
      publishing: false,
      looperOn: false
    };

    const reloadExpenses = function () {
      ss.data.thinList = els.data.thinList;
      ss.doSearch();
    };
    const clearFilter = function () {
      ss.initializeData();
      if (ms.data.page === C.PAGES.DASHBOARD) {
				// clear filter for Bills
        if (acs.data.filterBy) {
          bs.data.filterApplied = false;
          bs.clearBillsList();
          bs.loadAllBills();
        }
        bs.data.filterBy = null;
        acs.data.filterBy = null;
      }
      reloadExpenses();
    };
    const loadAddItem = function (dt) {
      els.addItem(dt.data);
    };
    const addItem = function (id) {
      aj.get('/dashboard/transaction/' + id, {}, loadAddItem);
    };
    const loadModifyItem = function (dt) {
      els.modifyItem(dt.data);
    };
    const modifyItem = function (id) {
      aj.get('/dashboard/transaction/' + id, {}, loadModifyItem);
    };
    const deleteItem = function (id) {
      els.deleteItem(id);
    };

		// swap Expenses.
    const resetSwapPool = function () {
      angular.forEach(data.tempPool, function (temp) {
        const i = {idx: -1, i: 0};

        for (i.i = 0; i.i < data.swapPool.length; i.i++) {
          if (temp.code === data.swapPool[i.i].code) {
            i.idx = i.i;
            break;
          }
        }
        if (i.idx > -1) {
          data.swapPool.splice(i.idx, 1);
        }
      });
      data.publishing = false;
      els.data.loading = false;
    };
    const publishSwap = function () {
      data.tempPool = [];
      angular.forEach(data.swapPool, function (swap) {
        data.tempPool.push(swap);
      });

      // console.log('Publishing swaps...' + tempPool.length);
      els.data.loading = true;
      aj.post('/edit/swap/' + ms.data.menu.city.id, data.tempPool, resetSwapPool);
    };
    const looper = function () {
      if (data.swapPool.length > 0) {
        if (!data.publishing) {
          data.publishing = true;
          publishSwap();
        }
        $timeout(function () {
          looper();
        }, DELAY);
      } else {
        data.looperOn = false;
      }
    };
    const swapExpense = function (idx1, idx2) {
      const id1 = els.data.rows[idx1].id;
      const id2 = els.data.rows[idx2].id;
      const code = (id1 * TEN) + id2; // unique code to identify.

      data.swapPool.push({
        code: code,
        fromTrans: id1,
        toTrans: id2
      });

			// swap them in the $view.
      const trans1 = els.data.rows[idx1];

      els.data.rows[idx1] = els.data.rows[idx2];
      els.data.rows[idx2] = trans1;
      els.loadCurrentPage();

      if (!data.looperOn) {
        data.looperOn = true;
        $timeout(function () {
          looper();
        }, DELAY);
      }
    };

    return {
      clearFilter: clearFilter,
      reloadExpenses: reloadExpenses,
      addItem: addItem,
      modifyItem: modifyItem,
      deleteItem: deleteItem,
      swapExpense: swapExpense
    };
  };

  angular.module('dashboard.explist').factory('explistwrapperService', explistwrapperService);
  explistwrapperService.$inject = ['explistService', 'etmenuService', 'searchService', 'accountsService',
    'billsService', 'ajaxService', 'utilsService', 'CONSTANTS', '$timeout'];
})(window.angular);
