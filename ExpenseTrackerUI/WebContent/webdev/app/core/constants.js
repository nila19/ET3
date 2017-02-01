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
			SUMMARY_COL: 13, // # of months @ Summary
			CHART_COL: 12, // # of months @ Chart
			SEARCH_ROW: 13, // # of Expense @ Search
			DASHBOARD_ROW: 4, // # of Expense @ Dashboard
			BILLS_ROW: 2, // # of Bills @ Dashboard
			ACCTS_COL: 6, // # of Accounts in a row @ Dashboard
			PAGINATE_BTN: 5, // # of Pagination buttons for Bills & ExpList
		},
		AMOUNT_REGEXP: /^-?\d+(?:\.\d{2}){0,1}$/,
		BASE_URL: 'http://localhost:8080/ExpenseTrackerWS/servlet',
		// BASE_URL: '../servlet',
		PAGES: {
			DASHBOARD: 'DASHBOARD',
			SUMMARY: 'SUMMARY',
			SEARCH: 'SEARCH'
		},
		HREF: {
			DASHBOARD: '/dashboard',
			SUMMARY: '/summary',
			SEARCH: '/search'
		},
		CURRENCY: {
			USD: 'USD',
			INR: 'INR'
		}
	});

})(window.angular);
