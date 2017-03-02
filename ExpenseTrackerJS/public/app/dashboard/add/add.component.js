/** ** ./dashboard/add/add.component.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.add').component('add', {
    templateUrl: 'dashboard/add/add.htm',
    controller: AddController
  });

  AddController.$inject = ['addService', 'explistService', 'utilsService', 'VALUES', 'CONSTANTS'];
  const AddController = function (as, els, us, V, C) {
    const vm = this;

    init();

		// ***** exposed functions ******//
    vm.addExpense = addExpense;

		// ***** function declarations *****//
    const init = function () {
      vm.data = as.data;
      vm.ta = V.data;
    };
    const isNull = function (e) {
      return !e || !e.id;
    };
    const addExpense = function (valid) {
      if (valid) {
        if (as.data.adjust && (isNull(as.data.fromAccount) && isNull(as.data.toAccount))) {
          us.show('Select at least one of From, To accounts!!', C.MSG.WARNING);
          return false;
        }
        as.addExpense();
      }
    };
  };
})(window.angular);
