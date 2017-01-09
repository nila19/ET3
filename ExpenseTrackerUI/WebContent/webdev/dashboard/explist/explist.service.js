/** ** ./dashboard/explist/explist.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').factory('explistService', explistService);

	explistService.$inject = ['CONSTANTS'];
	function explistService(C) {
		var page = '';
		var data;

		var getPage = function() {
			return page;
		};
		var setPage = function(page) {
			this.page = page;
		};
		var getData = function() {
			return data;
		};
		var setData = function(data) {
			this.data = data;
		};

		return {
			getPage: getPage,
			setPage: setPage,
			getData: getData,
			setData: setData
		};
	}

})(window.angular);
