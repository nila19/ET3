/** ** ./summary/summary.service.js *** */

(function(angular) {
	'use strict';

	angular.module('summary').factory('summaryService', summaryService);

	summaryService.$inject = ['etmenuService', 'CONSTANTS'];
	function summaryService(ms, C) {
		var data = {
			header: [],
			header2: [],
			rows: [],
			maxPageNo: 0,
			pgData: {},
			currPageNo: 0,
			adhoc: false,
			regular: false,
			forecast: false
		};
		var cols = C.SIZES.SUMMARY_COL;

		var dummyData = function() {
			return {
				header: [{
					mth: 'JAN-17',
					aggr: false
				}, {
					mth: '2016',
					aggr: true
				}, {
					mth: 'DEC-16',
					aggr: false
				}, {
					mth: 'NOV-16',
					aggr: false
				}, {
					mth: 'OCT-16',
					aggr: false
				}, {
					mth: 'SEP-16',
					aggr: false
				}, {
					mth: 'AUG-16',
					aggr: false
				}, {
					mth: 'JUL-16',
					aggr: false
				}, {
					mth: 'JUN-16',
					aggr: false
				}, {
					mth: 'MAY-16',
					aggr: false
				}, {
					mth: 'APR-16',
					aggr: false
				}, {
					mth: 'MAR-16',
					aggr: false
				}, {
					mth: 'FEB-16',
					aggr: false
				}, {
					mth: 'JAN-16',
					aggr: false
				}, {
					mth: '2015',
					aggr: true
				}, {
					mth: 'DEC-15',
					aggr: false
				}, {
					mth: 'NOV-15',
					aggr: false
				}, {
					mth: 'OCT-15',
					aggr: false
				}],
				header2: [1000.91, 12000.90, 1000.92, 1000.91, 1000.90, 1000.99, 1000.98, 1000.97,
						1000.96, 1000.95, 1000.92, 1000.91, 1000.90, 1000.99, 1000.98, 1000.97,
						1000.96, 1000.95],
				rows: [
						{
							cat: {
								id: 175,
								name: 'Food ~ Kroger Groceries',
								main: 'Food',
								sub: 'Kroger Groceries',
								icon: 'local_mall'
							},
							cols: [100.91, 1200.90, 100.99, 100.99, 100.99, 100.99, 100.98, 100.97,
									100.96, 100.95, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95]
						},
						{
							cat: {
								id: 179,
								name: 'Transport ~ Car Gas',
								main: 'Transport',
								sub: 'Car Gas',
								icon: 'local_gas_station'
							},
							cols: [100.91, 1200.90, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95]
						},
						{
							cat: {
								id: 175,
								name: 'Food ~ Kroger Groceries',
								main: 'Food',
								sub: 'Kroger Groceries',
								icon: 'local_mall'
							},
							cols: [100.91, 1200.90, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95]
						},
						{
							cat: {
								id: 179,
								name: 'Transport ~ Car Gas',
								main: 'Transport',
								sub: 'Car Gas',
								icon: 'local_gas_station'
							},
							cols: [100.91, 1200.90, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95]
						},
						{
							cat: {
								id: 175,
								name: 'Food ~ Kroger Groceries',
								main: 'Food',
								sub: 'Kroger Groceries',
								icon: 'local_mall'
							},
							cols: [100.91, 1200.90, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95]
						},
						{
							cat: {
								id: 179,
								name: 'Transport ~ Car Gas',
								main: 'Transport',
								sub: 'Car Gas',
								icon: 'local_gas_station'
							},
							cols: [100.91, 1200.90, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95]
						},
						{
							cat: {
								id: 175,
								name: 'Food ~ Kroger Groceries',
								main: 'Food',
								sub: 'Kroger Groceries',
								icon: 'local_mall'
							},
							cols: [100.91, 1200.90, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95]
						},
						{
							cat: {
								id: 179,
								name: 'Transport ~ Car Gas',
								main: 'Transport',
								sub: 'Car Gas',
								icon: 'local_gas_station'
							},
							cols: [100.91, 1200.90, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95]
						},
						{
							cat: {
								id: 170,
								name: 'House ~ Rent',
								main: 'House',
								sub: 'Rent',
								icon: 'home'
							},
							cols: [100.91, 1200.90, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
									100.96, 100.95]
						}]
			};
		};

		var loadSummary = function() {
			// TODO Ajax generate Summary from DB
			console.log('Loading Summary @ vDB :: ' + ms.data.menu.city.name + ', ' +
					this.data.adhoc + ', ' + this.data.regular + ', ' + this.data.forecast);
			this.loadData(dummyData());
		};
		var loadData = function(data) {
			this.data.header = data.header;
			this.data.header2 = data.header2;
			this.data.rows = data.rows;
			this.data.maxPageNo = Math.ceil(this.data.header.length / cols) - 1;
			this.data.currPageNo = 0;
			this.loadDataForPage();
		};
		var loadDataForPage = function() {
			var pageno = this.data.currPageNo;
			this.data.pgData.header = this.data.header.slice(pageno * cols, (pageno + 1) * cols);
			this.data.pgData.header2 = this.data.header2.slice(pageno * cols, (pageno + 1) * cols);

			var pgRows = [];
			this.data.rows.forEach(function(row) {
				var pgRow = {};
				pgRow.cat = row.cat;
				pgRow.cols = row.cols.slice(pageno * cols, (pageno + 1) * cols);
				pgRows.push(pgRow);
			});
			this.data.pgData.rows = pgRows;
		};

		return {
			data: data,
			loadSummary: loadSummary,
			loadData: loadData,
			loadDataForPage: loadDataForPage
		};
	}

})(window.angular);
