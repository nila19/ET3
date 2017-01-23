/** ** ./core/values.js *** */

(function(angular) {
	'use strict';

	angular.module('core').value('VALUES', {
		data: {
			city: {},
			cities: [],
			categories: [],
			descriptions: [],
			accounts: [],
			transMonths: [],
			entryMonths: [],
			bills: []
		}
	});

})(window.angular);
