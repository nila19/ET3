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

var navMain = {
	init: function() {
		// Change currency when city changes.
		$('#icon_currency_inr').hide();

		navEventMapper.map();
	}
};
