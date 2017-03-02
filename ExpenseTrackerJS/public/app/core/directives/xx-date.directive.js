/** ** ./core/directives/xx-date.directive.js *** */

(function(angular) {
	'use strict';

	angular.module('core.directives').directive('xxDate', xxDate);

	xxDate.$inject = ['CONSTANTS', '$filter', '$browser'];
	function xxDate(CONSTANTS, $filter, $browser) {
		return {
			require: 'ngModel',
			link: date
		};

		function date($scope, $element, $attrs, ctrl) {
			// Runs when model gets updated on the scope directly; Keeps view in sync
			ctrl.$render = function() {
				$element.val($filter('date')(ctrl.$viewValue, 'dd-MMM-yyyy'));
			};
		}
	}

})(window.angular);
