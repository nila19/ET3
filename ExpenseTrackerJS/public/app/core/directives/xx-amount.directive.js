/** ** ./core/directives/xx-amount.directive.js *** */

(function(angular) {
	'use strict';

	angular.module('core.directives').directive('xxAmount', xxAmount);

	xxAmount.$inject = ['CONSTANTS', '$filter', '$browser'];
	function xxAmount(CONSTANTS, $filter, $browser) {
		return {
			require: 'ngModel',
			link: amount
		};

		// /////////////////////
		function amount($scope, $element, $attrs, ctrl) {
			// Validator
			ctrl.$validators.xxAmount = function(mv, vv) {
				if (ctrl.$isEmpty(mv) || CONSTANTS.AMOUNT_REGEXP.test(vv)) {
					return true;
				}
				return false;
			};

			// Formatter - formats number to currency using inbuilt formatter.
			var formatter = function() {
				var value = $element.val().replace(/[^-.\d]/g, '');
				ctrl.$viewValue = value;
				$element.val($filter('currency')(value));
			};

			var trimmer = function() {
				$element.val(ctrl.$viewValue);
			};

			// Extracts digits out of the input & store in model. Defaults to 0.
			ctrl.$parsers.push(function(viewValue) {
				return viewValue.replace(/[^-.\d]/g, '');
			});

			// Runs when model gets updated on the scope directly; Keeps view in sync
			ctrl.$render = function() {
				$element.val($filter('currency')(ctrl.$viewValue));
			};

			// Gets triggered during onChange event in the
			$element.bind('focus', trimmer);

			// Gets triggered during onChange event in the
			$element.bind('focusout', formatter);
		}
	}

})(window.angular);
