/** ** ./summary/summary.service.js *** */

(function(angular) {
	'use strict';

	angular.module('summary').factory('summaryService', summaryService);

	summaryService.$inject = ['etmenuService', 'ajaxService', 'CONSTANTS'];
	function summaryService(ms, aj, C) {
		var data = {
			months: [],
			totalrow: {},
			rows: [],
			pgData: {},
			maxPageNo: 0,
			currPageNo: 0,
			columns: 0,
			input: {
				city: 0,
				forecast: false,
				adhoc: true,
				regular: true
			}
		};

		var loadCurrentPage = function() {
			var pg = data.currPageNo;
			var cols = data.columns;
			data.pgData.months = data.months.slice(pg * cols, (pg + 1) * cols);
			data.pgData.totalrow = data.totalrow.amount.slice(pg * cols, (pg + 1) * cols);

			var pgRows = [];
			data.rows.forEach(function(row) {
				var pgRow = {};
				pgRow.category = row.category;
				pgRow.amount = row.amount.slice(pg * cols, (pg + 1) * cols);
				pgRow.count = row.count.slice(pg * cols, (pg + 1) * cols);
				pgRows.push(pgRow);
			});
			data.pgData.rows = pgRows;
		};
		var loadData = function(dt) {
			data.totalrow = dt.splice(0, 1)[0];
			data.rows = dt;
			data.maxPageNo = Math.ceil(data.months.length / data.columns) - 1;
			data.currPageNo = 0;
			loadCurrentPage();
			ms.data.loading = false;
		};
		var loadSummary = function() {
			ms.data.loading = true;
			data.input.city = ms.data.menu.city.id;
			aj.query('/summary/go', data.input, loadData);
		};

		return {
			data: data,
			loadSummary: loadSummary,
			loadCurrentPage: loadCurrentPage
		};
	}

})(window.angular);
