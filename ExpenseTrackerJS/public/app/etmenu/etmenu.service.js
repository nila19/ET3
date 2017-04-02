/** ** ./etmenu/etmenu.service.js *** */

import './etmenu.module';

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
