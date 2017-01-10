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
		SUMMARY_PAGE_SIZE: 4,
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
