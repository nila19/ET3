/** ** ./core/services/ajax.service.js *** */

(function(angular) {
	'use strict';

	angular.module('core.services').factory('ajaxService', ajaxService);

	ajaxService.$inject = ['utilsService', 'CONSTANTS', '$resource'];
	function ajaxService(us, C, $resource) {
		return {
			url: url,
			get: get,
			post: post
		};
		function url(path) {
			var url = C.BASE_URL + path;
			return $resource(url);
		}
		function get(path, data, ok) {
			url(path).get(angular.toJson(data), ok, error);
		}
		function post(path, data, ok) {
			url(path).save(angular.toJson(data), ok, error);
		}

		function error(resp) {
			us.show('AJAX Error!!.. ' + resp.status + ' :: ' + resp.statusText, C.MSG.DANGER);
		}
	}

})(window.angular);
