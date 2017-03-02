/** ** ./dashboard/billpay/billpay.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.billpay').component('billpay', {
		templateUrl: 'dashboard/billpay/billpay.htm',
		controller: BillPayController
	});

	BillPayController.$inject = ['billpayService', 'billsService', 'VALUES'];
	function BillPayController(bps, bs, V) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.payBill = payBill;

		// ***** Function declarations *****//
		function init() {
			vm.data = bps.data;
			vm.ta = V.data;
		}

		function payBill(valid) {
			if (valid) {
				bs.data.loading = true;
				bps.payBill();
				$('#model_BillPay').modal('hide');
			}
		}
	}
})(window.angular);
