/** ** ./core/services/utils.service.js *** */

import './services.module';

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
