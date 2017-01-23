package com.expense.mvc.service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.expense.mvc.model.dao.AccountDAO;
import com.expense.mvc.model.dao.BillDAO;
import com.expense.mvc.model.dao.CategoryDAO;
import com.expense.mvc.model.dao.DataKeyDAO;
import com.expense.mvc.model.dao.TransactionDAO;
import com.expense.mvc.model.entity.Account;
import com.expense.mvc.model.entity.Bill;
import com.expense.mvc.model.entity.Category;
import com.expense.mvc.model.entity.DataKey;
import com.expense.mvc.model.ui.AccountUI;
import com.expense.mvc.model.ui.BillUI;
import com.expense.mvc.model.ui.CategoryUI;
import com.expense.mvc.model.ui.CityUI;
import com.expense.mvc.model.ui.MonthUI;
import com.expense.utils.FU;

@Service
public class StartupService {
	private static final Logger logger = LogManager.getLogger("log." + StartupService.class);

	@Autowired
	private DataKeyDAO dataKeyDAO;

	@Autowired
	private AccountDAO accountDAO;

	@Autowired
	private CategoryDAO categoryDAO;

	@Autowired
	private TransactionDAO transactionDAO;

	@Autowired
	private BillDAO billDAO;

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public boolean canConnect() {
		boolean valid = true;
		try {
			accountDAO.findAll();
		} catch (Exception e) {
			StartupService.logger.error("System Error...", e);
			valid = false;
		}
		return valid;
	}

	public boolean isLoggedIn() {
		return true;
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
	public List<AccountUI> getAllActiveAccounts(int dataKey) {
		List<Account> accts = accountDAO.findAllActive(dataKey);

		List<AccountUI> uis = new ArrayList<AccountUI>();
		for (Account acct : accts) {
			uis.add(new AccountUI(acct));
		}
		return uis;
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<AccountUI> getAllAccounts(int dataKey) {
		List<Account> accts = accountDAO.findAll(dataKey);

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

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public Account getAccount(int acctId) {
		Account acct = accountDAO.findById(acctId);

		// Load the lazy loaded attributes.
		if (acct.getLastBill() != null) {
			acct.getLastBill().getBillId();
		}
		if (acct.getOpenBill() != null) {
			acct.getOpenBill().getBillId();
		}

		return acct;
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public void saveAccount(Account account) {
		accountDAO.save(account);
	}

	// **************************** Category ****************************//
	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<CategoryUI> getAllCategories(int dataKey) {
		List<Category> cats = categoryDAO.findAllActive(dataKey);

		List<CategoryUI> uis = new ArrayList<CategoryUI>();
		for (Category cat : cats) {
			uis.add(new CategoryUI(cat));
		}
		return uis;
	}

	// **************************** Month ****************************//
	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<MonthUI> getAllEntryMonths(int dataKey) {
		return toDateList(transactionDAO.findAllEntryMonths(dataKey));
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<MonthUI> getAllTransMonths(int dataKey) {
		return toDateList(transactionDAO.findAllTransMonths(dataKey));
	}

	private List<MonthUI> toDateList(List<String> strs) {
		List<MonthUI> dates = new ArrayList<MonthUI>();
		for (String str : strs) {
			try {
				dates.add(new MonthUI(FU.date(FU.Date.yyyyMMdd).parse(str)));
			} catch (ParseException e) {
			}
		}
		return dates;
	}

	// **************************** Description ****************************//
	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<String> getAllDescription(int dataKey) {
		return transactionDAO.findAllDescription(dataKey);
	}

	// **************************** Bill ****************************//
	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<BillUI> getAllBills(int dataKey) {
		List<Bill> bills = billDAO.findAll(dataKey);

		List<BillUI> uis = new ArrayList<BillUI>();
		for (Bill bill : bills) {
			uis.add(new BillUI(bill));
		}
		return uis;
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<BillUI> getAllOpenBills(int dataKey) {
		List<Bill> bills = billDAO.findAllOpen(dataKey);

		List<BillUI> uis = new ArrayList<BillUI>();
		for (Bill bill : bills) {
			uis.add(new BillUI(bill));
		}
		return uis;
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public Bill getBill(int dataKey, int billId) {
		Bill bill = billDAO.findById(billId);
		// Initialize the lazy initialized lists.
		bill.getTransForFromBill().size();
		bill.getTransForToBill().size();
		return bill;
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public void saveBill(Bill bill) {
		billDAO.save(bill);
	}
}
