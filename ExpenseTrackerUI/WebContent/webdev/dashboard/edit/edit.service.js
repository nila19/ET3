/** ** ./dashboard/edit/edit.service.js *** */

(function(angular) {
	'use strict';

	angular.module('dashboard.edit').factory('editService', editService);

	editService.$inject = ['editFunctionsService', 'CONSTANTS'];
	function editService(efs, C) {
		var data = {};

		var fetchExp = function(id) {
			efs.fetchExp(id, this.data);
		};
		var saveExp = function() {
			return efs.saveExp(this.data);
			// TODO Refresh exp list.
		};
		var deleteExp = function() {
			return efs.deleteExp(this.data.id);
			// TODO Refresh exp list.
		};
		var swapExp = function(id1, id2) {
			return efs.swapExp(id1, id2);
			// TODO Refresh exp list.
		};

		return {
			data: data,
			fetchExp: fetchExp,
			saveExp: saveExp,
			deleteExp: deleteExp,
			swapExp: swapExp
		};
	}

})(window.angular);
