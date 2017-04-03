/** ** ./core/values.js *** */

(function (angular) {
  'use strict';

  angular.module('core').value('VALUES', {
    data: {
      env: null,
      city: {},
      cities: [],
      categories: [],
      descriptions: [],
      accounts: [],
      transMonths: [],
      entryMonths: [],
      bills: []
    }
  });
})(window.angular);
