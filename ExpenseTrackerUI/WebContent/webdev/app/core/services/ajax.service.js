/** ** ./core/services/ajax.service.js *** */

(function(angular) {
	'use strict';

	angular.module('core.services').factory('ajaxService', ajaxService);

	ajaxService.$inject = ['utilsService', 'CONSTANTS', '$resource'];
	function ajaxService(us, C, $resource) {
		return {
			url: url,
			get: get,
			query: query,
			post: post
		};
		function url(path) {
			var url = C.BASE_URL + path;
			return $resource(url);
		}
		function get(path, data, ok) {
			url(path).get(data, ok, error);
		}
		function query(path, data, ok) {
			url(path).query(data, ok, error);
		}
		function post(path, data, ok) {
			url(path).save(data, ok, error);
		}

		function error(resp) {
			console.log(resp);
			us.show('AJAX Error!!.. ' + resp.status + ' :: ' + resp.statusText, C.MSG.DANGER);
		}
	}

})(window.angular);
