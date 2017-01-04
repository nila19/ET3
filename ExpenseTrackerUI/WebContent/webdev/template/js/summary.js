var summaryEventMapper = {
	map: function() {
		$(':button[data-refresh-summary]').click(function() {
			appUtils.msg.show('Summary Refresh');
		});
		$(':input[type="checkbox"]').change(function() {
			appUtils.msg.show('Summary Refresh');
		});
	}
};

var summaryMain = {
	init: function() {
		summaryEventMapper.map();
	}
};
