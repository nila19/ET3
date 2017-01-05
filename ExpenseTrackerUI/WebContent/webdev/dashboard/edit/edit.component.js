/** ** ./dashboard/edit/edit.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.edit').component('edit', {
		templateUrl: 'dashboard/edit/edit.htm',
		controller: EditController
	});

	EditController.$inject = ['editService', 'CONSTANTS', '$location'];
	function EditController(es, CONSTANTS, $location) {
		var vm = this;

		// /////////////////////
	}
})(window.angular);
