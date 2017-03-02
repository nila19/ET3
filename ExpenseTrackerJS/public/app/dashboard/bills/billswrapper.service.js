/** ** ./dashboard/bills/billswrapper.service.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.bills').factory('billswrapperService', billswrapperService);

  billswrapperService.$inject = ['billsService', 'billpayService', 'utilsService'];
  function billswrapperService(bs, bps, us) {
    const showBillPay = function (id) {
      const bill = us.getObjectOf(bs.data.rows, id);

      bps.loadData(bill);
    };

    return {
      showBillPay: showBillPay
    };
  }
})(window.angular);
