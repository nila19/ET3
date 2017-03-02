/** ** ./dashboard/bills/billswrapper.service.js *** */

(function (angular) {
  'use strict';

  const billswrapperService = function (bs, bps, us) {
    const showBillPay = function (id) {
      const bill = us.getObjectOf(bs.data.rows, id);

      bps.loadData(bill);
    };

    return {
      showBillPay: showBillPay
    };
  };

  angular.module('dashboard.bills').factory('billswrapperService', billswrapperService);
  billswrapperService.$inject = ['billsService', 'billpayService', 'utilsService'];
})(window.angular);
