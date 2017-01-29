/** ** ./startup/startup.component.js *** */

(function(angular) {
	'use strict';

	angular.module('startup').component('startup', {
		templateUrl: 'startup/startup.htm',
		controller: StartupController
	});

	StartupController.$inject = ['startupService', 'etmenuService', 'CONSTANTS', 'VALUES',
			'$location', '$timeout'];
	function StartupController(sus, ms, C, V, $location, $timeout) {
		var vm = this;
		init();

		// ***** Function declarations *****//
		function init() {
			vm.data = sus.data;
			sus.loadAll();
			checkLoadComplete();
		}

		function checkLoadComplete() {
			if (!V.data.city.id || ms.data.loading) {
				$timeout(function() {
					checkLoadComplete();
				}, 500);
			} else {
				$location.path('/dashboard');
			}
		}
	}
})(window.angular);
