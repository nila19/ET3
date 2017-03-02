/** ** ./core/directives/xx-tooltip.directive.js *** */

(function (angular) {
  'use strict';

  angular.module('core.directives').directive('tooltip', tooltip);

  const tooltip = function () {
    // const tooltip = function (scope, element, $attrs, ctrl) {
    const tooltip = function (scope, element) {
      $(element).hover(function () {
        $(element).tooltip('show');
      }, function () {
        $(element).tooltip('hide');
      });
    };

    return {
      restrict: 'A',
      link: tooltip
    };
  };
})(window.angular);
