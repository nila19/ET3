/** ** ./search/search.component.js *** */

(function(angular) {
	'use strict';

	angular.module('search').component('search', {
		templateUrl: 'search/search.htm',
		controller: SearchController
	});

	SearchController.$inject = ['searchService', 'CONSTANTS', '$location'];
	function SearchController(ss, CONSTANTS, $location) {
		var vm = this;

		// /////////////////////
	}
})(window.angular);
