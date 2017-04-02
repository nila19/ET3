/** ** ./core/values.js *** */

import './core.module';

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
