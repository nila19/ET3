/** ** ./dashboard/explist/explist.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').component('explist', {
		templateUrl: 'dashboard/explist/explist.htm',
		controller: ExplistController
	});

	ExplistController.$inject = ['explistService', 'editService', 'searchService', 'CONSTANTS'];
	function ExplistController(els, es, ss, C) {
		var vm = this;
		init();

		// ***** Exposed functions ******//
		vm.hasPrevPage = hasPrevPage;
		vm.hasNextPage = hasNextPage;
		vm.prevPage = prevPage;
		vm.nextPage = nextPage;
		vm.showModifyExpense = showModifyExpense;
		vm.showDeleteExpense = showDeleteExpense;
		vm.changeSequence = changeSequence;
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

		function showModifyExpense(id) {
			es.loadExpense(id);
			$('#model_Modify').modal('show');
		}

		function showDeleteExpense(id) {
			es.loadExpense(id);
			$('#model_Delete').modal('show');
		}

		function changeSequence(id, code) {
			var idx = els.getIndexOf(id);
			var id2 = els.data.rows[idx + code].id;
			es.swapExpense(id, id2);
			// TODO Refresh exp list.
		}

		function clearFilter() {
			if (els.data.page === C.PAGES.SEARCH) {
				ss.initializeData();
			}
			els.data.filterApplied = false;
			els.loadAllExpenses();
		}
	}
})(window.angular);
