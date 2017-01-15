/** ** ./dashboard/explist/explist.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').component('explist', {
		templateUrl: 'dashboard/explist/explist.htm',
		controller: ExplistController
	});

	ExplistController.$inject = ['explistService', 'editService', 'etmenuService', 'searchService',
			'CONSTANTS'];
	function ExplistController(els, es, ms, ss, C) {
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

		function changeSequence(id, diff) {
			var idx = els.getIndexOf(id);
			var id2 = els.data.rows[idx + diff].id;
			es.swapExpense(id, id2);
			els.loadAllExpenses();
		}

		function clearFilter() {
			els.clearFilter();
		}
	}
})(window.angular);
