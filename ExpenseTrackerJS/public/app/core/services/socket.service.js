/** ** ./core/services/socket.service.js *** */
/* global io */

(function (angular) {
  'use strict';

  const socketService = function (acs) {
    let on = false;
    const socket = io();

    const init = function () {
      if(on) { // initialize only once. if called second time, do nothing.
        return;
      }
      on = true;
      socket.on('account', function (acct) {
        acs.loadAccount(acct);
      });
    };

    return {
      init: init
    };
  };

  angular.module('core.services').factory('socketService', socketService);
  socketService.$inject = ['accountsService'];
})(window.angular);
