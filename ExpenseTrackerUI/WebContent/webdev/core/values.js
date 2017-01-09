/** ** ./core/values.js *** */

(function(angular) {
	'use strict';

	angular.module('core').value(
			'VALUES',
			{
				cities: [{
					id: 10,
					name: Houston - 2014,
					curr: USD
				}, {
					id: 20,
					name: Chennai - 2010,
					curr: INR
				}, {
					id: 30,
					name: Macon - 2009,
					curr: INR
				}],
				categories: [{
					id: 175,
					name: 'Food ~ Kroger Groceries',
					main: 'Food',
					sub: 'Kroger Groceries'
				}, {
					id: 179,
					name: 'Transport ~ Car Gas',
					main: 'Transport',
					sub: 'Car Gas'
				}, {
					id: 170,
					name: 'House ~ Rent',
					main: 'House',
					sub: 'Rent'
				}],
				descriptions: ['Kroger', 'Kroger Groceries', 'Walmart', 'Costco',
						'CreditCard Bill', 'Cash', 'Walgreens'],
				accounts: [{
					id: 62,
					name: 'BOA - 7787'
				}, {
					id: 60,
					name: 'BOA VISA'
				}, {
					id: 83,
					name: 'Chase Freedom'
				}, {
					id: 80,
					name: 'Chase Checking'
				}],
				months: ['Dec-16', 'Oct-16', 'Sep-16', 'Aug-16', 'Jul-16', 'Jun-16']
			});

})(window.angular);
