/** ** ./core/directives/xx-tooltip.directive.js *** */

(function(angular) {
	'use strict';

	angular.module('core.directives').directive('tooltip', tooltip);

	function tooltip() {
		return {
			restrict: 'A',
			link: tooltip
		};

		// /////////////////////
		function tooltip(scope, element, $attrs, ctrl) {
			$(element).hover(function() {
				$(element).tooltip('show');
			}, function() {
				$(element).tooltip('hide');
			});
		}
	}

})(window.angular);
