var searchEventMapper = {
	map: function() {
		// On click of : Delete Expense from List
		$('#cardExpenseList :button[data-btn-edit-expense]').click(function() {
			if ($(this).attr('data-btn-edit-expense') === 'DELETE') {
				$('#modalDeleteExpense').modal('show');
			}
		});

		// On click of : Delete Expense OK
		$('#btnDeleteExpenseAction').click(function() {
			$('#modalDeleteExpense').modal('hide');
			appUtils.msg.show('Delete Expense');
		});

		// On click of : Modify Expense from List
		$('#cardExpenseList :button[data-btn-edit-expense]').click(function() {
			if ($(this).attr('data-btn-edit-expense') === 'MODIFY') {
				$('#modalModifyExpense').modal('show');
			}
		});

		// On click of : Modify Expense OK
		$('#btnModifyExpenseAction').click(function() {
			$('#modalModifyExpense').modal('hide');
			appUtils.msg.show('Modify Expense');
		});
	}
};

var searchMain = {
	init: function() {
		searchEventMapper.map();
	}
};
