/** ** ./dashboard/add/add.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.add').component('add', {
		templateUrl: 'dashboard/add/add.htm',
		controller: AddController
	});

	AddController.$inject = ['addService', 'CONSTANTS', '$location'];
	function AddController(ads, CONSTANTS, $location) {
		var vm = this;

		// /////////////////////
	}
})(window.angular);
