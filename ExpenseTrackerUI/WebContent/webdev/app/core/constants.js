/** ** ./core/constants.js *** */

(function(angular) {
	'use strict';

	angular.module('core').constant('CONSTANTS', {
		MSG: {
			INFO: 'info',
			SUCCESS: 'success',
			WARNING: 'warning',
			DANGER: 'danger'
		},
		SIZES: {
			SUMMARY_COL: 4,
			SEARCH_ROW: 5, // # of Expense @ Search
			DASHBOARD_ROW: 4, // # of Expense @ Dashboard
			BILLS_ROW: 2, // # of Bills @ Dashboard
			ACCTS_COL: 6
		},
		AMOUNT_REGEXP: /^-?\d+(?:\.\d{2}){0,1}$/,
		BASE_URL: 'http://localhost:8080/TestWebServices/servlet',
		// BASE_URL: './servlet',
		PAGES: {
			DASHBOARD: 'DASHBOARD',
			SUMMARY: 'SUMMARY',
			SEARCH: 'SEARCH'
		},
		CURRENCY: {
			USD: 'USD',
			INR: 'INR'
		},
		URLs: {
			Login: '/access/in',
			Forget: '/access/fgt'
		}
	});

})(window.angular);
