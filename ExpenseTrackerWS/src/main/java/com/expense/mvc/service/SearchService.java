package com.expense.mvc.service;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.expense.mvc.model.dao.TransactionDAO;
import com.expense.mvc.model.entity.Transaction;
import com.expense.mvc.model.ui.SearchUI;
import com.expense.mvc.model.ui.TransactionUI;

@Service
public class SearchService {

	@Autowired
	private TransactionDAO transactionDAO;

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<TransactionUI> search(Map<String, String> input) {
		List<Transaction> trans = this.transactionDAO.findForSearch(toSearchUI(input));

		List<TransactionUI> uis = new ArrayList<TransactionUI>();
		for (Transaction tran : trans) {
			uis.add(new TransactionUI(tran));
		}
		return uis;
	}

	private SearchUI toSearchUI (Map<String, String> input) {
		SearchUI ui = new SearchUI();
		try {
			BeanUtils.populate(ui, input);
		} catch (IllegalAccessException | InvocationTargetException e) {
			e.printStackTrace();
		}
		return ui;
	}
}
