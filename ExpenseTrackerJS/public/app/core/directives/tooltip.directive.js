/** ** ./core/directives/xx-tooltip.directive.js *** */

import './directives.module';

(function (angular) {
  'use strict';

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

  angular.module('core.directives').directive('tooltip', tooltip);
})(window.angular);
