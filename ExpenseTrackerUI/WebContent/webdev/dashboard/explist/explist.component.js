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

		init();

		// ***** Exposed functions ******//
		vm.hasPrevPage = hasPrevPage;
		vm.hasNextPage = hasNextPage;
		vm.prevPage = prevPage;
		vm.nextPage = nextPage;
		vm.showModifyExp = showModifyExp;
		vm.showDeleteExp = showDeleteExp;
		vm.changeSeq = changeSeq;
		vm.clearFilter = clearFilter;

		// ***** Function declarations *****//
		function init() {
			vm.data = els.pgData;
		}

		function hasPrevPage() {
			return els.currPageNo > 0;
		}

		function hasNextPage() {
			return els.currPageNo < els.maxPageNo;
		}

		function prevPage() {
			els.currPageNo -= 1;
			els.loadDataForPage();
		}

		function nextPage() {
			els.currPageNo += 1;
			els.loadDataForPage();
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
