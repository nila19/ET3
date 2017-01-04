var appSummary = {
	// Initialization method for Summary page
	init: function() {
		$(':button[data-refresh-summary]').click(function() {
			appUtils.msg.show('Summary Refresh');
		});
		$(':input[type="checkbox"]').change(function() {
			appUtils.msg.show('Summary Refresh');
		});
	}
};
