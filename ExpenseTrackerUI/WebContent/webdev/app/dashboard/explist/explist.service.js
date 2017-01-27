/** ** ./dashboard/explist/explist.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').factory('explistService', explistService);

	explistService.$inject = ['utilsService', 'CONSTANTS'];
	function explistService(us, C) {
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
			thinListToggle: false,
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
		var loadCurrentPage = function() {
			var pg = data.currPageNo;
			data.pgData.rows = data.rows.slice(pg * data.rowCount, (pg + 1) * data.rowCount);
		};
		var paginate = function() {
			data.maxPageNo = Math.ceil(data.rows.length / data.rowCount) - 1;
			calTotal();
			loadCurrentPage();
		};
		var loadData = function(dt) {
			this.data.rows = dt;
			this.data.currPageNo = 0;
			this.data.loading = false;

			paginate();
		};

		var addItem = function(item) {
			data.rows.unshift(item);
			paginate();
		};
		var modifyItem = function(item) {
			var idx = us.getIndexOf(data.rows, item.id);
			data.rows[idx] = item;
			paginate();
		};
		var deleteItem = function(id) {
			data.rows.splice(us.getIndexOf(data.rows, id), 1);
			paginate();
		};

		return {
			data: data,
			loadData: loadData,
			paginate: paginate,
			loadCurrentPage: loadCurrentPage,
			addItem: addItem,
			modifyItem: modifyItem,
			deleteItem: deleteItem
		};
	}

})(window.angular);
