/** ** ./dashboard/billpay/billpay.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.billpay').factory('billpayService', billpayService);

	billpayService.$inject = ['etmenuService', 'utilsService'];
	function billpayService(ms, us) {
		var data = {
			bill: null,
			pay: {
				acc: '',
				paidDt: ''
			}
		};

		var dummyBill = function() {
			return {
				bill: {
					id: 302,
					acc: {
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
					acc: '',
					paidDt: ''
				}
			};
		};

		var initForm = function(d) {
			d.pay.acc = '';
			d.pay.paidDt = '';
		};
		var loadBill = function(id) {
			console.log('Getting info for Bill @ vDB :: ' + id + ',' + ms.data.menu.city.name);
			// TODO Ajax fetch bill details.
			this.loadData(dummyBill());
		};
		var loadData = function(data) {
			this.data.bill = data.bill;
			this.data.pay = data.pay;
		};
		var payBill = function() {
			console.log('Paying Bill @ vDB :: ' + ms.data.menu.city.name + ',' +
					JSON.stringify(this.data));
			// TODO Ajax fetch bill details.
			us.showMsg('Bill Pay', 'success');
			initForm(this.data);
		};

		return {
			data: data,
			loadBill: loadBill,
			loadData: loadData,
			payBill: payBill
		};
	}

})(window.angular);
