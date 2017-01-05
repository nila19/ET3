/** ** ./summary/summary.component.js *** */

var summaryEventMapper = {
	map: function() {
		$(':button[data-refresh-summary]').click(function() {
			appUtils.msg.show('Summary Refresh');
		});
		$(':input[type="checkbox"]').change(function() {
			appUtils.msg.show('Summary Refresh');
		});
	}
};

var summaryMain = {
	init: function() {
		summaryEventMapper.map();
	}
};

(function(angular) {
	'use strict';

	angular.module('summary').component('summary', {
		templateUrl: 'summary/summary.htm',
		controller: SummaryController
	});

	SummaryController.$inject = ['summaryService', 'CONSTANTS', '$location'];
	function SummaryController(sms, CONSTANTS, $location) {
		var vm = this;

		summaryMain.init();
		// /////////////////////
	}
})(window.angular);
