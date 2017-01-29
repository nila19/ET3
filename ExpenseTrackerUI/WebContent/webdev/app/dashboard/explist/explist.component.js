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
		vm.hasPrevPageSet = hasPrevPageSet;
		vm.hasNextPageSet = hasNextPageSet;
		vm.prevPageSet = prevPageSet;
		vm.nextPageSet = nextPageSet;
		vm.page = page;
		vm.loadPage = loadPage;
		vm.showModifyExpense = showModifyExpense;
		vm.showDeleteExpense = showDeleteExpense;
		vm.swapExpense = swapExpense;
		vm.clearFilter = clearFilter;
		vm.toggleThinList = toggleThinList;

		// ***** Function declarations *****//
		function init() {
			vm.data = els.data;
		}

		function hasPrevPageSet() {
			return els.data.currPageSet > 0;
		}

		function hasNextPageSet() {
			return ((els.data.currPageSet + 1) * els.data.pageSetSize) <= els.data.maxPageNo;
		}

		function prevPageSet() {
			els.data.currPageSet -= 1;
		}

		function nextPageSet() {
			els.data.currPageSet += 1;
		}

		// idx will be 0,1,2,3,4
		function page(idx) {
			return (els.data.currPageSet * els.data.pageSetSize) + idx;
		}

		function loadPage(pg) {
			els.data.currPageNo = pg;
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
