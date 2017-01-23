/** ** ./dashboard/bills/billswrapper.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.bills').factory('billswrapperService', billswrapperService);

	billswrapperService.$inject = ['billsService', 'billpayService'];
	function billswrapperService(bs, bps) {
		var showBillPay = function(id) {
			var bill = bs.data.rows[bs.getIndexOf(id)];
			bps.loadData(bill);
		};
		return {
			showBillPay: showBillPay
		};
	}

})(window.angular);
