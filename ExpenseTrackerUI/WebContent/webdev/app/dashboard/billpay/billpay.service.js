/** ** ./dashboard/billpay/billpay.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.billpay').factory('billpayService', billpayService);

	billpayService.$inject = ['billsService', 'accountsService', 'explistwrapperService',
			'ajaxService', 'utilsService'];
	function billpayService(bs, acs, elws, aj, us) {
		var data = {
			bill: null,
			pay: {
				account: '',
				paidDt: ''
			}
		};

		var initForm = function() {
			data.pay.account = '';
			data.pay.paidDt = '';
		};
		var loadData = function(data) {
			this.data.bill = data;
			initForm();
		};
		var loadPayBill = function() {
			us.showMsg('Bill Pay', 'success');
			bs.refreshBill(data.bill.id);

			acs.refreshAccount(data.bill.account.id);
			acs.refreshAccount(data.pay.account.id);
			elws.reloadExpenses();
		};
		var payBill = function() {
			aj.post('/entry/paybill/' + data.bill.id, this.data.pay, loadPayBill);
		};

		return {
			data: data,
			loadData: loadData,
			payBill: payBill
		};
	}

})(window.angular);
