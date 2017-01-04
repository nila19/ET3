var appNavbar = {
	init: function() {
		// Change currency when city changes.
		$('#icon_currency_inr').hide();
		var cityOption = $('#selectChangeCity').find('a[data-city-currency]');
		cityOption.click(function() {
			var a = $(this);
			var cityName = a.attr('data-city-option');
			$('#selectChangeCity').find('span[data-city-selected]').html(cityName);

			var currency = a.attr('data-city-currency');
			if (currency === 'INR') {
				$('#icon_currency_inr').show();
				$('#icon_currency_usd').hide();
			} else {
				$('#icon_currency_inr').hide();
				$('#icon_currency_usd').show();
			}

			// If in Dashboard page, reset the page.
			// if ($('#cardBills')) {
			// appDashboard.init();
			// }
			appUtils.msg.show('City Change');
		});
	}
};
