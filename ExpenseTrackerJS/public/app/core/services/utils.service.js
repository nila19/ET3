/** ** ./core/services/utils.service.js *** */

(function (angular) {
  'use strict';

  angular.module('core.services').factory('utilsService', utilsService);

  // utilsService.$inject = ['CONSTANTS'];
  const utilsService = function () {
    const DELAY = 2000; // milliseconds

    const getObjectOf = function (arr, id) {
      let o = null;

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === Number(id)) {
          o = arr[i];
          break;
        }
      }
      return o;
    };
    const getIndexOf = function (arr, id) {
      let idx = null;

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === Number(id)) {
          idx = i;
          break;
        }
      }
      return idx;
    };

		// popup message
    const showMsg = function (action, t) {
      const msg = '<b>' + action + '</b> - Completed successfully.';

      show(msg, t);
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
})(window.angular);
