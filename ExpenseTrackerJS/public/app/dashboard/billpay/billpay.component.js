/** ** ./dashboard/billpay/billpay.component.js *** */

(function (angular) {
  'use strict';

  const BillPayController = function (bps, bs, V) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = bps.data;
      vm.ta = V.data;
    };

    const payBill = function (valid) {
      if (valid) {
        bs.data.loading = true;
        bps.payBill();
        $('#model_BillPay').modal('hide');
      }
    };

    init();

		// ***** exposed functions ******//
    vm.payBill = payBill;
  };

  angular.module('dashboard.billpay').component('billpay', {
    templateUrl: 'dashboard/billpay/billpay.htm',
    controller: BillPayController
  });
  BillPayController.$inject = ['billpayService', 'billsService', 'VALUES'];
})(window.angular);
