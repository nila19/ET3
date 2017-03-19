/** ** ./core/services/utils.service.js *** */

(function (angular) {
  'use strict';

  const utilsService = function (C) {
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
