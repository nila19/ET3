/** ** ./summary/summary.component.js *** */

(function(angular) {
	'use strict';

	angular.module('summary').component('summary', {
		templateUrl: 'summary/summary.htm',
		controller: SummaryController
	});

	SummaryController.$inject = ['summaryService', 'etmenuService', 'explistService',
			'utilsService', 'CONSTANTS', 'VALUES', '$location'];
	function SummaryController(sms, ms, els, us, C, V, $location) {
		var vm = this;

		init();
		reload();

		// ***** Exposed functions ******//
		vm.reload = reload;
		vm.changePage = changePage;
		vm.hasPrevPage = hasPrevPage;
		vm.hasNextPage = hasNextPage;
		vm.prevPage = prevPage;
		vm.nextPage = nextPage;
		vm.listExp = listExp;

		// ***** Function declarations *****//
		function init() {
			ms.page = C.PAGES.SUMMARY;
			els.rowCount = C.SIZES.SEARCH_ROW;
			vm.pageNo = 0;
			vm.maxPageNo = 0;
			vm.data = {};
			vm.adhoc = false;
			vm.regular = false;
			vm.forecast = false;
		}

		function reload() {
			sms.loadData(ms.city, vm.adhoc, vm.regular, vm.forecast);
			sms.getDataForPage(vm.data, vm.pageNo);
			vm.maxPageNo = sms.getMaxPage();
		}

		function changePage(incr) {
			vm.pageNo += incr;
			sms.getDataForPage(vm.data, vm.pageNo);
		}

		function listExp(cat, mIdx, aggr) {
			if (!aggr) {
				var path = '/search/' + cat + '/' + vm.data.header[mIdx].mth;
				console.log(path);
				$location.path(path);
			}
		}

		function hasPrevPage() {
			return vm.pageNo > 0;
		}

		function hasNextPage() {
			return vm.pageNo < vm.maxPageNo;
		}

		function prevPage() {
			changePage(-1);
		}

		function nextPage() {
			changePage(+1);
		}
	}
})(window.angular);
