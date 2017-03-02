/** ** ./core/values.js *** */

(function (angular) {
  'use strict';

  angular.module('core').value('VALUES', {
    data: {
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
