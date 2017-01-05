/**** ./core/directives/xx-integer.directive.js ****/

(function(angular) {
	'use strict';

	angular.module('directives').directive('xxInteger', xxInteger);

	xxInteger.$inject = ['CONSTANTS'];
	function xxInteger(CONSTANTS) {
		return {
			require: 'ngModel',
			link: integer
		};
		///////////////////////
		function integer(scope, elm, attrs, ctrl) {
			ctrl.$validators.xxInteger = function(mv, vv) {
				if (ctrl.$isEmpty(mv) || CONSTANTS.INTEGER_REGEXP.test(vv)) {
					return true;
				}
				return false;
			};
		}
	}

})(window.angular);
