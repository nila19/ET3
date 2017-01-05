/** ** ./app.module.js *** */

(function(angular) {
	'use strict';

	angular.module('app', ['filters', 'directives', 'ngRoute']);

	angular.module('app').config(['$compileProvider', function($compileProvider) {
		$compileProvider.debugInfoEnabled(false);
		$compileProvider.commentDirectivesEnabled(false);
		$compileProvider.cssClassDirectivesEnabled(false);
	}]);

})(window.angular);
