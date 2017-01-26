/** ** ./dashboard/explist/explist.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').component('explist', {
		templateUrl: 'dashboard/explist/explist.htm',
		controller: ExplistController
	});

	ExplistController.$inject = ['explistwrapperService', 'explistService', 'editService',
			'utilsService', 'CONSTANTS'];
	function ExplistController(elws, els, es, us, C) {
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
		vm.toggleThinList = toggleThinList;

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
			els.loadCurrentPage();
		}

		function nextPage() {
			els.data.currPageNo += 1;
			els.loadCurrentPage();
		}

		function showModifyExpense(id) {
			editExpense(id);
			$('#model_Modify').modal('show');
		}

		function showDeleteExpense(id) {
			editExpense(id);
			$('#model_Delete').modal('show');
		}

		function editExpense(id) {
			// No need to fetch from DB. Fetch from local, clone & show in popup.
			var trans = jQuery.extend({}, us.getObjectOf(els.data.rows, id));
			es.loadData(trans);
		}

		function swapExpense(id, diff) {
			var idx = us.getIndexOf(els.data.rows, id);
			elws.swapExpense(idx, idx + diff);
		}

		function clearFilter() {
			elws.clearFilter();
		}

		function toggleThinList() {
			if (els.data.thinListToggle) {
				els.data.thinList = !els.data.thinList;
				elws.reloadExpenses();
			}
		}
	}
})(window.angular);
