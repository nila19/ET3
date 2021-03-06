/** ** ./dashboard/billpay/billpay.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.billpay').factory('billpayService', billpayService);

	billpayService.$inject = ['etmenuService', 'billsService', 'accountsService',
			'explistwrapperService', 'ajaxService', 'utilsService'];
	function billpayService(ms, bs, acs, elws, aj, us) {
		var data = {
			bill: null,
			city: null,
			account: '',
			paidDt: ''
		};

		var initForm = function() {
			data.account = '';
			data.paidDt = '';
		};
		var loadData = function(dt) {
			data.bill = dt;
			initForm();
		};
		var loadPayBill = function(dt) {
			us.showMsg('Bill Pay', 'success');
			bs.refreshBill(data.bill.id);
			// Add the newly added Expense to the top of the Expenselist..
			elws.addItem(dt.id);

			acs.refreshAccount(data.bill.account.id);
			acs.refreshAccount(data.account.id);
		};
		var payBill = function() {
			data.city = ms.data.menu.city;
			aj.post('/entry/paybill', data, loadPayBill);
		};

		return {
			data: data,
			loadData: loadData,
			payBill: payBill
		};
	}

})(window.angular);
