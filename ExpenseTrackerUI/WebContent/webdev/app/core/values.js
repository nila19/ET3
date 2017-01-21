/** ** ./core/values.js *** */

(function(angular) {
	'use strict';

	angular.module('core').value('VALUES', {
		data: {
			city: {
				id: 10,
				name: 'Houston - 2014',
				currency: 'USD'
			},
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
