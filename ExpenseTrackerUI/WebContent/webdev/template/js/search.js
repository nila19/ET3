var searchFunctions = {
	initEditExpModel: function(action, type) {
		if (action === 'DELETE') {
			$('#modalDeleteExpense [data-edit-exp-field]').hide();
			$('#modalDeleteExpense [data-edit-exp-field = "' + type + '"]').show();
		}
		if (action === 'MODIFY') {
			$('#modalModifyExpense [data-edit-exp-field]').hide();
			$('#modalModifyExpense [data-edit-exp-field = "' + type + '"]').show();
		}
	}
};

var searchEventMapper = {
	map: function() {
		// On click of : Delete Expense from List
		$('#cardExpenseList :button[data-btn-edit-expense]').click(
				function() {
					if ($(this).attr('data-btn-edit-expense') === 'DELETE') {
						searchFunctions.initEditExpModel('DELETE', $(this).attr(
								'data-btn-edit-expense-type'));
						$('#modalDeleteExpense').modal('show');
					}
				});

		// On click of : Delete Expense OK
		$('#btnDeleteExpenseAction').click(function() {
			$('#modalDeleteExpense').modal('hide');
			appUtils.msg.show('Delete Expense');
		});

		// On click of : Modify Expense from List
		$('#cardExpenseList :button[data-btn-edit-expense]').click(
				function() {
					if ($(this).attr('data-btn-edit-expense') === 'MODIFY') {
						searchFunctions.initEditExpModel('MODIFY', $(this).attr(
								'data-btn-edit-expense-type'));
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
