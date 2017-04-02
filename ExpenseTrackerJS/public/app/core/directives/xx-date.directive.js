/** ** ./core/directives/xx-date.directive.js *** */

import './directives.module';

(function (angular) {
  'use strict';

  const xxDate = function (CONSTANTS, $filter) {
    const date = function ($scope, $element, $attrs, ctrl) {
			// runs when model gets updated on the scope directly; Keeps view in sync
      ctrl.$render = function () {
        $element.val($filter('date')(ctrl.$viewValue, 'dd-MMM-yyyy'));
      };
    };

    return {
      require: 'ngModel',
      link: date
    };
  };

  angular.module('core.directives').directive('xxDate', xxDate);
  xxDate.$inject = ['CONSTANTS', '$filter'];
})(window.angular);
