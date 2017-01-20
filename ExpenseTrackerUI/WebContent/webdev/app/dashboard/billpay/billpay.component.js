/** ** ./dashboard/billpay/billpay.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.billpay').component('billpay', {
		templateUrl: 'dashboard/billpay/billpay.htm',
		controller: BillPayController
	});

	BillPayController.$inject = ['billpayService', 'VALUES'];
	function BillPayController(bps, V) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.payBill = payBill;

		// ***** Function declarations *****//
		function init() {
			vm.data = bps.data;
			vm.ta = V.data;
			// typeAheads();
		}

		// function typeAheads() {
		// vm.ta = {};
		// vm.ta.accounts = V.data.accounts;
		// }

		function payBill(valid) {
			if (valid) {
				bps.payBill();
				$('#model_BillPay').modal('hide');
			}
		}
	}
})(window.angular);
