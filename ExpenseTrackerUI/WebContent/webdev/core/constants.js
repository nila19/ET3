/** ** ./core/constants.js *** */

(function(angular) {
	'use strict';

	angular.module('core').constant('CONSTANTS', {
		AMOUNT_REGEXP: /^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
		BASE_URL: 'http://localhost:8080/TestWebServices/servlet',
		// BASE_URL: './servlet',
		URLs: {
			Login: '/access/in',
			Forget: '/access/fgt'
		}
	});

})(window.angular);
