/** ** ./dashboard/billpay/billpay.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.billpay').factory('billpayService', billpayService);

	billpayService.$inject = ['CONSTANTS'];
	function billpayService(C) {
		var data = {};

		var fetchBill = function(id) {
			console.log('Getting info for Bill from vDB :: ' + id);
			// TODO Ajax fetch bill details.
			this.loadData(this.dummyBill());
		};
		var dummyBill = function() {
			return {
				bill: {
					id: 302,
					acct: {
						id: 83,
						name: 'Chase Freedom'
					},
					name: '14-Dec-17 #0085',
					billDt: 1298323623006,
					billAmt: 250.45,
					dueDt: 1228323623006,
					paid: false,
					paidDt: null
				},
				pay: {
					acct: {},
					paidDt: ''
				}
			};
		};
		var loadData = function(data) {
			this.data.bill = data.bill;
			this.data.pay = data.pay;
		};
		var payBill = function() {
			console.log('Paying Bill @ vDB :: ' + JSON.stringify(this.data));
			// TODO Ajax fetch bill details.
		};

		return {
			data: data,
			fetchBill: fetchBill,
			dummyBill: dummyBill,
			loadData: loadData,
			payBill: payBill
		};
	}

})(window.angular);
