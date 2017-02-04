package com.expense.mvc.service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.expense.mvc.model.dao.AccountDAO;
import com.expense.mvc.model.dao.CategoryDAO;
import com.expense.mvc.model.dao.DataKeyDAO;
import com.expense.mvc.model.dao.TransactionDAO;
import com.expense.mvc.model.entity.Account;
import com.expense.mvc.model.entity.Category;
import com.expense.mvc.model.entity.DataKey;
import com.expense.mvc.model.ui.AccountMinUI;
import com.expense.mvc.model.ui.AccountUI;
import com.expense.mvc.model.ui.CategoryUI;
import com.expense.mvc.model.ui.CityUI;
import com.expense.mvc.model.ui.FlagMinUI;
import com.expense.mvc.model.ui.MonthUI;
import com.expense.utils.FU;

@Service
public class StartupService {

	@Autowired
	private DataKeyDAO dataKeyDAO;

	@Autowired
	private AccountDAO accountDAO;

	@Autowired
	private CategoryDAO categoryDAO;

	@Autowired
	private TransactionDAO transactionDAO;

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public FlagMinUI connect() {
		boolean valid = false;
		try {
			dataKeyDAO.findAll();
			valid = true;
		} catch (Exception e) {
		}
		return new FlagMinUI(valid);
	}

	// **************************** DataKey ****************************//
	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<CityUI> getAllDataKeys() {
		List<DataKey> dkeys = dataKeyDAO.findAll();

		List<CityUI> uis = new ArrayList<CityUI>();
		for (DataKey dkey : dkeys) {
			uis.add(new CityUI(dkey));
		}
		return uis;
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public CityUI getDefaultDataKey() {
		return new CityUI(dataKeyDAO.findDefault());
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public CityUI getDataKeyById(int dataKey) {
		return new CityUI(dataKeyDAO.findById(dataKey));
	}

	// **************************** Account ****************************//
	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<AccountMinUI> getAllActiveAccountsThin(int dataKey) {
		List<Account> accts = accountDAO.findAllActive(dataKey);

		List<AccountMinUI> uis = new ArrayList<AccountMinUI>();
		for (Account acct : accts) {
			uis.add(new AccountMinUI(acct));
		}
		return uis;
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<AccountMinUI> getAllInactiveAccountsThin(int dataKey) {
		List<Account> accts = accountDAO.findAllInactive(dataKey);

		List<AccountMinUI> uis = new ArrayList<AccountMinUI>();
		for (Account acct : accts) {
			uis.add(new AccountMinUI(acct));
		}
		return uis;
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<AccountUI> getAllActiveAccounts(int dataKey) {
		List<Account> accts = accountDAO.findAllActive(dataKey);

		List<AccountUI> uis = new ArrayList<AccountUI>();
		for (Account acct : accts) {
			uis.add(new AccountUI(acct));
		}
		return uis;
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public AccountUI getAccountUI(int acctId) {
		return new AccountUI(accountDAO.findById(acctId));
	}

	// **************************** Category ****************************//
	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<CategoryUI> getCategories(int dataKey) {
		List<Category> cats = categoryDAO.findAllActive(dataKey);

		List<CategoryUI> uis = new ArrayList<CategoryUI>();
		for (Category cat : cats) {
			uis.add(new CategoryUI(cat));
		}
		return uis;
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<CategoryUI> getAllCategories(int dataKey) {
		List<Category> cats = categoryDAO.findAll(dataKey);

		List<CategoryUI> uis = new ArrayList<CategoryUI>();
		for (Category cat : cats) {
			uis.add(new CategoryUI(cat));
		}
		return uis;
	}

	// **************************** Month ****************************//
	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<MonthUI> getAllEntryMonths(int dataKey) throws ParseException {
		return toDateList(transactionDAO.findAllEntryMonths(dataKey));
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<MonthUI> getAllTransMonths(int dataKey) throws ParseException {
		return toDateList(transactionDAO.findAllTransMonths(dataKey));
	}

	private List<MonthUI> toDateList(List<java.sql.Date> dates) throws ParseException {
		List<MonthUI> months = new ArrayList<MonthUI>();
		for (java.sql.Date date : dates) {
			months.add(new MonthUI(new Date(date.getTime()), false));
		}
		addYears(months);
		return months;
	}

	private void addYears(List<MonthUI> months) throws ParseException {
		MonthUI currMonth = new MonthUI(new Date());
		boolean currMonthPresent = false;
		HashMap<Integer, Date> years = new HashMap<Integer, Date>();
		for (MonthUI month : months) {
			Calendar c = FU.getYearEnd(month.getId());
			years.put(c.get(Calendar.YEAR), c.getTime());
			if (month.getSeq() == currMonth.getSeq()) {
				currMonthPresent = true;
			}
		}
		for (int yr : years.keySet()) {
			months.add(new MonthUI(years.get(yr), true));
		}
		if (!currMonthPresent) {
			months.add(new MonthUI(new Date()));
		}
		Collections.sort(months);
		Collections.reverse(months);
	}

	// **************************** Description ****************************//
	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<String> getAllDescription(int dataKey) {
		return transactionDAO.findAllDescription(dataKey);
	}
}
