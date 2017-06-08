/** ** ./dashboard/billpay/billpay.component.js *** */

(function (angular) {
  'use strict';

  const BillPayController = function (bps, bs, us, V, C) {
    const vm = this;

		// ***** function declarations *****//
    const init = function () {
      vm.data = bps.data;
      vm.ta = V.data;
    };
    const payBill = function (form) {
      if (form.$valid) {
        bs.data.loading = true;
        const amt = _.toNumber(vm.data.paidAmt);

        if(amt <= 0 || amt > vm.data.bill.balance) {
          us.show('1 - Payment amout should be between 0 & bill balance.!!', C.MSG.WARNING);
          return false;
        }
        bps.payBill();
        $('#model_BillPay').modal('hide');
      }
    };

    // ***** exposed functions ******//
    vm.payBill = payBill;

    init();
  };

  angular.module('dashboard.billpay').component('billpay', {
    templateUrl: 'dashboard/billpay/billpay.htm',
    controller: BillPayController
  });
  BillPayController.$inject = ['billpayService', 'billsService', 'utilsService', 'VALUES', 'CONSTANTS'];
})(window.angular);
