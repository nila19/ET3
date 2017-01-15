/** ** ./core/services/ajax.service.js *** */

(function(angular) {
	'use strict';

	angular.module('core.services').factory('ajaxService', ajaxService);

	ajaxService.$inject = ['CONSTANTS', '$resource'];
	function ajaxService(C, $resource) {
		return {
			getURL: getURL
		};
		// /////////////////////
		function getURL(func) {
			var url = C.BASE_URL + C.URLs[func];
			// return $http.post(url,obj);
			return $resource(url);
		}
	}

})(window.angular);
