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

			typeAheads();
		}

		function typeAheads() {
			$('#bp_account').typeahead({
				source: V.accounts,
				minLength: 0,
				updater: function(item) {
					bps.data.pay.acct.id = item.id;
					return item;
				}
			});
		}

		function payBill() {
			// TODO Form validations.
			bps.payBill();
			$('#model_BillPay').modal('hide');
		}
	}
})(window.angular);
