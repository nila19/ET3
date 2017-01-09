/** ** ./etmenu/etmenu.component.js *** */

var navFunctions = {
	changeCity: function(name, currency) {
		$('#selectChangeCity').find('span[data-city-selected]').html(name);
		if (currency === 'INR') {
			$('#icon_currency_inr').show();
			$('#icon_currency_usd').hide();
		} else {
			$('#icon_currency_inr').hide();
			$('#icon_currency_usd').show();
		}
	}
};

var navEventMapper = {
	map: function() {
		// On click of : City Change
		$('#selectChangeCity').find('a[data-city-currency]').click(function() {
			var a = $(this);
			var name = a.attr('data-city-option');
			var currency = a.attr('data-city-currency');

			navFunctions.changeCity(name, currency);
			appUtils.msg.show('City Change');
			// TODO Refresh the page.
		});
	}
};

(function(angular) {
	'use strict';

	angular.module('etmenu').component('etmenu', {
		templateUrl: 'etmenu/etmenu.htm',
		controller: ETMenuController
	});

	ETMenuController.$inject = ['etmenuService', 'CONSTANTS', 'CONSTANTS', '$location'];
	function ETMenuController(ms, C, V, $location) {
		var vm = this;
		var showbuttons = (ms.getPage() === C.PAGES.DASHBOARD);

		init();
		// /////////////////////

		function init() {
			$('#icon_currency_inr').hide();

		}
	}
})(window.angular);
