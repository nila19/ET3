/** ** ./dashboard/add/add.component.js *** */

(function (angular) {
  'use strict';

  const AddController = function (as, els, us, V, C) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = as.data;
      vm.ta = V.data;
    };
    const isNull = function (e) {
      return !e || !e.id;
    };
    const id = function (e) {
      return (e && e.id) ? e.id : 0;
    };
    const addExpense = function (form) {
      if (form.$valid) {
        if (as.data.expense.adjust) {
          const accts = as.data.expense.accounts;

          if(isNull(accts.from) && isNull(accts.to)) {
            us.show('Select at least one of From, To accounts!!', C.MSG.WARNING);
            return false;
          } else if(id(accts.from) && id(accts.to) && (id(accts.from) === id(accts.to))) {
            us.show('From & To accounts cannot be the same!!', C.MSG.WARNING);
            return false;
          }
        }
        as.addExpense();
      }
    };

    init();

		// ***** exposed functions ******//
    vm.addExpense = addExpense;
  };

  angular.module('dashboard.add').component('add', {
    templateUrl: 'dashboard/add/add.htm',
    controller: AddController
  });
  AddController.$inject = ['addService', 'explistService', 'utilsService', 'VALUES', 'CONSTANTS'];
})(window.angular);
