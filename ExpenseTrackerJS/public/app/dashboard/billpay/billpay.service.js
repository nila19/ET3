/** ** ./dashboard/billpay/billpay.service.js *** */

(function (angular) {
  'use strict';

  const billpayService = function (ms, bs, acs, elws, aj, us) {
    const data = {
      bill: null,
      city: null,
      account: '',
      paidAmt: 0,
      paidDt: ''
    };

    const initForm = function () {
      data.account = '';
      data.paidDt = '';
      data.bill.balance = _.round(data.bill.balance, 2);
      data.bill.amount = _.round(data.bill.amount, 2);
      // default it to balance amount.
      data.paidAmt = data.bill.balance;
    };
    const loadData = function (dt) {
      data.bill = dt;
      initForm();
    };
    const loadPayBill = function (dt) {
      us.showMsg('Bill Pay', dt.code);
      bs.data.loading = false;
      if(dt.code === 0) {
			// add the newly added Expense to the top of the Expenselist..
        elws.addItem(dt.data.id);
      }
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

  angular.module('dashboard.billpay').factory('billpayService', billpayService);
  billpayService.$inject = ['etmenuService', 'billsService', 'accountsService', 'explistwrapperService', 'ajaxService',
    'utilsService'];
})(window.angular);
