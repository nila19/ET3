/** ** ./core/services/socket.service.js *** */
/* global io */

(function (angular) {
  'use strict';

  const socketService = function (acs, bs) {
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
      socket.on('bill', function (bill) {
        bs.loadBill(bill);
      });
    };

    return {
      init: init
    };
  };

  angular.module('core.services').factory('socketService', socketService);
  socketService.$inject = ['accountsService', 'billsService'];
})(window.angular);
