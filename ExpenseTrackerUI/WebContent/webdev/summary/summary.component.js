/** ** ./summary/summary.component.js *** */

(function(angular) {
	'use strict';

	angular.module('summary').component('summary', {
		templateUrl: 'summary/summary.htm',
		controller: SummaryController
	});

	SummaryController.$inject = ['summaryService', 'CONSTANTS', '$location'];
	function SummaryController(sms, CONSTANTS, $location) {
		var vm = this;

		// /////////////////////
	}
})(window.angular);
