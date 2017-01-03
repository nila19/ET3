$('#modalAddExpense').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget); // Button that triggered the modal
	var recipient = button.data('whatever'); // Extract info from data-* attributes
	// You could initiate an AJAX request here (and then do the updating in a callback).
	var modal = $(this);
	modal.find('.modal-title').text('New message to ' + recipient);
	modal.find('.modal-body input').val(recipient);
});

$('#exampleModal').on('hidden.bs.modal', function(e) {
	console.log('Adios....');
});

$('#exampleModal button#button-send').on('click', function(event) {
	console.log('Sending email via gmail...');
	$('#exampleModal').modal('hide');
});

$('#SomeButton').on('click', function(event) {
	console.log('Opening menu...');
	$('#shoppingdd').dropdown('toggle');
});

$('#shoppingdd').on('show.bs.dropdown', function() {
	console.log('Opening menu...');
});
