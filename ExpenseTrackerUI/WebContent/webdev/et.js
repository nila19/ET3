function initNavbar() {
	// Navbar change currency when city is changed.
	$('#et_currency_inr').hide();
	$('#et_city').find('a[data-currency]').click(function() {
		var a = $(this);
		var curr = a.attr('data-currency');
		$('#et_city').find('span[data-city-fl]').html(a.attr('data-city'));

		if (curr === 'INR') {
			$('#et_currency_inr').show();
			$('#et_currency_usd').hide();
		} else {
			$('#et_currency_inr').hide();
			$('#et_currency_usd').show();
		}
	});
}

function initDashboard() {
	console.log('Initializing buttons....');

	// Load Bills tabs based on account click
	$('#acct1').click(function() {
		console.log('BOA 7787 clicked....');
		$('#h_bills_open').removeClass('active').hide();
		$('#currentbills').hide();
		$('#h_bills_closed').addClass('active');
		$('#pastbills').show();
	});

	$('#acct3').click(function() {
		console.log('BOA VISA clicked....');
		$('#h_bills_closed').removeClass('active');
		$('#pastbills').hide();
		$('#h_bills_open').addClass('active').show();
		$('#currentbills').show();
	});

	// Hide second row of accounts
	$('div[data-et-row="2"]').hide();
	var row2shown = false;

	$('a#toggle2row').click(function() {
		console.log('2row clicked....');
		if (row2shown) {
			$('div[data-et-row="2"]').hide();
			row2shown = !row2shown;
		} else {
			$('div[data-et-row="2"]').show();
			row2shown = !row2shown;
			$('a#toggle2row > i').html('expand_less');
		}
	});
}
