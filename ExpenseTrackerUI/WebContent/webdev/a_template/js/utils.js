var appUtils = {
	// Popup message
	msg: {
		types: ['', 'info', 'success', 'warning', 'danger'],
		show: function(action) {
			$.notify({
				icon: 'notifications',
				message: '<b>' + action + '</b> - Completed successfully.'
			}, {
				type: 'success',
				delay: 1000,
				placement: {
					from: 'top',
					align: 'center'
				}
			});
		}
	}
};
