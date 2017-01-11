/** ** ./summary/summary.service.js *** */

(function(angular) {
	'use strict';

	angular.module('summary').factory('summaryService', summaryService);

	summaryService.$inject = ['CONSTANTS'];
	function summaryService(C) {
		var maxPage = 0;
		var data;

		// TODO Delete later
		var dummyData = function() {
			this.data = {
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
				}],
				header2: [1000.91, 12000.90, 1000.92, 1000.91, 1000.90, 1000.99, 1000.98, 1000.97,
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
							cols: [100.91, 1200.90, 100.92, 100.91, 100.90, 100.99, 100.98, 100.97,
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
									100.96, 100.95]
						}]
			};
		};

		var loadData = function(city, adhoc, regular, forecast) {
			console.log('Loading Summ from vDB :: ' + city + ', ' + adhoc + ', ' + regular + ', ' +
					forecast);
			this.dummyData();
			// TODO Ajax load from prod to local data.
			this.maxPage = Math.ceil(this.data.header.length / C.SIZES.SUMMARY_COL) - 1;
		};
		var getDataForPage = function(pgData, pageno) {
			var pgSz = C.SIZES.SUMMARY_COL;
			pgData.header = this.data.header.slice(pageno * pgSz, (pageno + 1) * pgSz);
			pgData.header2 = this.data.header2.slice(pageno * pgSz, (pageno + 1) * pgSz);

			var pgRows = [];
			this.data.rows.forEach(function(row) {
				var pgRow = {};
				pgRow.cat = row.cat;
				pgRow.cols = row.cols.slice(pageno * pgSz, (pageno + 1) * pgSz);
				pgRows.push(pgRow);
			});
			pgData.rows = pgRows;
		};

		var getMaxPage = function() {
			return this.maxPage;
		};
		var setMaxPage = function(maxPage) {
			this.maxPage = maxPage;
		};

		return {
			data: data,
			maxPage: maxPage,
			dummyData: dummyData,
			loadData: loadData,
			getDataForPage: getDataForPage,
			getMaxPage: getMaxPage,
			setMaxPage: setMaxPage
		};
	}

})(window.angular);
