/** ** ./dashboard/billpay/billpay.service.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.billpay').factory('billpayService', billpayService);

  billpayService.$inject = ['etmenuService', 'billsService', 'accountsService',
    'explistwrapperService', 'ajaxService', 'utilsService'];
  const billpayService = function (ms, bs, acs, elws, aj, us) {
    const data = {
      bill: null,
      city: null,
      account: '',
      paidDt: ''
    };

    const initForm = function () {
      data.account = '';
      data.paidDt = '';
    };
    const loadData = function (dt) {
      data.bill = dt;
      initForm();
    };
    const loadPayBill = function (dt) {
      us.showMsg('Bill Pay', 'success');
      bs.refreshBill(data.bill.id);
			// add the newly added Expense to the top of the Expenselist..
      elws.addItem(dt.id);

      acs.refreshAccount(data.bill.account.id);
      acs.refreshAccount(data.account.id);
    };
    const payBill = function () {
      data.city = ms.data.menu.city;
      aj.post('/edit/paybill', data, loadPayBill);
    };

    return {
      data: data,
      loadData: loadData,
      payBill: payBill
    };
  };
})(window.angular);
