/** ** ./dashboard/explist/explist.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').factory('explistService', explistService);

	explistService.$inject = ['CONSTANTS'];
	function explistService(C) {
		var data = {
			pgData: {
				rows: []
			},
			maxPageNo: 0,
			currPageNo: 0,
			rowCount: 1,
			loading: false,
			filterApplied: false,
			thinList: true,
			total: 0,
			rows: []
		};

		var calTotal = function() {
			var tot = 0;
			data.rows.forEach(function(row) {
				tot += row.amount;
			});
			data.total = tot;
		};
		var loadData = function(data) {
			this.data.rows = data;

			this.data.maxPageNo = Math.ceil(this.data.rows.length / this.data.rowCount) - 1;
			this.data.currPageNo = 0;
			this.loadDataForPage();
			calTotal();
			this.data.loading = false;
		};
		var loadDataForPage = function() {
			var pg = data.currPageNo;
			data.pgData.rows = data.rows.slice(pg * data.rowCount, (pg + 1) * data.rowCount);
		};
		var getIndexOf = function(transId) {
			var idx;
			data.rows.forEach(function(row, i) {
				if (row.transId === transId) {
					idx = i;
				}
			});
			return idx;
		};

		var reloadListAfterDelete = function(transId) {
			var idx = getIndexOf(transId);
			data.rows.splice(idx, 1);
			loadDataForPage();
		};

		return {
			data: data,
			loadData: loadData,
			loadDataForPage: loadDataForPage,
			getIndexOf: getIndexOf,
			reloadListAfterDelete: reloadListAfterDelete,
		};
	}

})(window.angular);
