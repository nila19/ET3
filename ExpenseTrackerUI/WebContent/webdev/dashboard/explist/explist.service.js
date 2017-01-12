/** ** ./dashboard/explist/explist.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').factory('explistService', explistService);

	explistService.$inject = ['CONSTANTS'];
	function explistService(C) {
		var page = '';
		var data = {};
		var pgData = {};
		var maxPageNo = 0;
		var currPageNo = 0;
		var rowCount = 1;

		var loadData = function(data) {
			this.data = data;
			this.currPageNo = 0;
			this.maxPageNo = Math.ceil(this.data.rows.length / this.rowCount) - 1;
			this.pgData.filterApplied = this.data.filterApplied;
			this.pgData.total = this.data.total;
			this.loadDataForPage();
		};
		var loadDataForPage = function() {
			var pg = this.currPageNo;
			this.pgData.rows = this.data.rows.slice(pg * this.rowCount, (pg + 1) * this.rowCount);
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
			data: data,
			pgData: pgData,
			maxPageNo: maxPageNo,
			currPageNo: currPageNo,
			rowCount: rowCount,
			loadData: loadData,
			loadDataForPage: loadDataForPage,
			getIndexOf: getIndexOf
		};
	}

})(window.angular);
