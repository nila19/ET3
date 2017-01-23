/** ** ./dashboard/explist/explist.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').component('explist', {
		templateUrl: 'dashboard/explist/explist.htm',
		controller: ExplistController
	});

	ExplistController.$inject = ['explistwrapperService', 'explistService', 'CONSTANTS'];
	function ExplistController(elws, els, C) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.hasPrevPage = hasPrevPage;
		vm.hasNextPage = hasNextPage;
		vm.prevPage = prevPage;
		vm.nextPage = nextPage;
		vm.showModifyExpense = showModifyExpense;
		vm.showDeleteExpense = showDeleteExpense;
		vm.swapExpense = swapExpense;
		vm.clearFilter = clearFilter;

		// ***** Function declarations *****//
		function init() {
			vm.data = els.data;
		}

		function hasPrevPage() {
			return els.data.currPageNo > 0;
		}

		function hasNextPage() {
			return els.data.currPageNo < els.data.maxPageNo;
		}

		function prevPage() {
			els.data.currPageNo -= 1;
			els.loadDataForPage();
		}

		function nextPage() {
			els.data.currPageNo += 1;
			els.loadDataForPage();
		}

		function showModifyExpense(transId) {
			elws.editExpense(transId);
			$('#model_Modify').modal('show');
		}

		function showDeleteExpense(transId) {
			elws.editExpense(transId);
			$('#model_Delete').modal('show');
		}

		function swapExpense(transId, diff) {
			var idx = els.getIndexOf(transId);
			elws.swapExpense(idx, idx + diff);
		}

		function clearFilter() {
			elws.clearFilter();
		}
	}
})(window.angular);
