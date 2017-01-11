/** ** ./dashboard/explist/explist.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').factory('explistService', explistService);

	explistService.$inject = ['CONSTANTS'];
	function explistService(C) {
		var page = '';
		var data;
		var maxPageNo = 0;
		var currPageNo = 0;
		var rowCount = 1;

		var loadData = function(data) {
			this.data = data;
			this.maxPageNo = Math.ceil(this.data.rows.length / this.rowCount) - 1;
		};
		var getDataForPage = function(pgData, pageno) {
			pgData.total = this.data.total;
			pgData.rows = this.data.rows
					.slice(pageno * this.rowCount, (pageno + 1) * this.rowCount);
		};
		var getMaxPage = function() {
			return this.maxPage;
		};
		var setMaxPage = function(maxPage) {
			this.maxPage = maxPage;
		};
		var getIndexOf = function(id) {
			var idx;
			this.data.rows.forEach(function(row, i) {
				if (row.id === id) {
					idx = i;
				}
			});
			return idx;
		};
		return {
			page: page,
			rowCount: rowCount,
			maxPageNo: maxPageNo,
			currPageNo: currPageNo,
			data: data,
			loadData: loadData,
			getDataForPage: getDataForPage,
			getMaxPage: getMaxPage,
			setMaxPage: setMaxPage,
			getIndexOf: getIndexOf
		};
	}

})(window.angular);
