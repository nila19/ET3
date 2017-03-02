/** ** ./core/directives/xx-amount.directive.js *** */

(function (angular) {
  'use strict';

  const xxAmount = function (CONSTANTS, $filter) {
    const amount = function ($scope, $element, $attrs, ctrl) {
			// validator
      ctrl.$validators.xxAmount = function (mv, vv) {
        if (ctrl.$isEmpty(mv) || CONSTANTS.AMOUNT_REGEXP.test(vv)) {
          return true;
        }
        return false;
      };
			// formatter - formats number to currency using inbuilt formatter.
      const formatter = function () {
        const value = $element.val().replace(/[^-.\d]/g, '');

        ctrl.$viewValue = value;
        $element.val($filter('currency')(value));
      };
      const trimmer = function () {
        $element.val(ctrl.$viewValue);
      };

			// extracts digits out of the input & store in model. Defaults to 0.
      ctrl.$parsers.push(function (viewValue) {
        return viewValue.replace(/[^-.\d]/g, '');
      });
			// runs when model gets updated on the scope directly; Keeps view in sync
      ctrl.$render = function () {
        $element.val($filter('currency')(ctrl.$viewValue));
      };
			// gets triggered during onChange event in the
      $element.bind('focus', trimmer);
			// gets triggered during onChange event in the
      $element.bind('focusout', formatter);
    };

    return {
      require: 'ngModel',
      link: amount
    };
  };

  angular.module('core.directives').directive('xxAmount', xxAmount);
  xxAmount.$inject = ['CONSTANTS', '$filter'];
})(window.angular);
