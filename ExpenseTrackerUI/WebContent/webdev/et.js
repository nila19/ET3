function initButtons() {
	console.log('Initializing buttons....');

	$('#acct1').click(function() {
		console.log('BOA clicked....');
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
