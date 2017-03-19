/** ** ./search/search.module.js *** */

(function (angular) {
  'use strict';

  angular.module('search', ['etmenu', 'core', 'core.directives', 'core.services',
    'dashboard.explist', 'dashboard.edit', 'ngRoute', 'ngAnimate', 'ui.bootstrap',
    'ui.bootstrap.typeahead']);
})(window.angular);
