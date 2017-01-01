function initButtons() {
	console.log('Initializing buttons....');

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

	// Default
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
