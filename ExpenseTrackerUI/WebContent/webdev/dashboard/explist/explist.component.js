/** ** ./dashboard/explist/explist.component.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.explist').component('explist', {
		templateUrl: 'dashboard/explist/explist.htm',
		controller: ExplistController
	});

	ExplistController.$inject = ['explistService', 'editService', 'CONSTANTS', '$location'];
	function ExplistController(els, es, C, $location) {
		var vm = this;
		vm.data = {};

		init();
		loadPage(0);

		// ***** Exposed functions ******//
		vm.loadPage = loadPage;
		vm.hasPrevPage = hasPrevPage;
		vm.hasNextPage = hasNextPage;
		vm.prevPage = prevPage;
		vm.nextPage = nextPage;
		vm.showModifyExp = showModifyExp;
		vm.showDeleteExp = showDeleteExp;
		vm.changeSeq = changeSeq;

		// ***** Function declarations *****//
		function init() {
			vm.filterApplied = false;
			// els.loadData(); // TODO Remove later, once search/DB implemented.
		}

		function loadPage(incr) {
			els.currPageNo += incr;
			els.getDataForPage(vm.data, els.currPageNo);
		}

		function hasPrevPage() {
			return els.currPageNo > 0;
		}

		function hasNextPage() {
			return els.currPageNo < els.maxPageNo;
		}

		function prevPage() {
			loadPage(-1);
		}

		function nextPage() {
			loadPage(+1);
		}

		function showModifyExp(id) {
			es.fetchExp(id);
			$('#model_Modify').modal('show');
		}

		function showDeleteExp(id) {
			es.fetchExp(id);
			$('#model_Delete').modal('show');
		}

		function changeSeq(id, code) {
			var idx = els.getIndexOf(id);
			var id2 = els.data.rows[idx + code].id;
			es.swapExp(id, id2);
		}

		function clearFilter() {
			// TODO Ask Dashboard ctrl to refresh & reload explist service.
		}
	}
})(window.angular);
