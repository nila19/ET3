package com.expense.mvc.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.expense.mvc.model.dao.AccountDAO;
import com.expense.mvc.model.dao.BillDAO;
import com.expense.mvc.model.entity.Account;
import com.expense.mvc.model.entity.Bill;
import com.expense.mvc.model.entity.Transaction;
import com.expense.mvc.model.ui.BillUI;

@Service
public class BillService {

	@Autowired
	private AccountDAO accountDAO;

	@Autowired
	private BillDAO billDAO;

	// **************************** Account ****************************//
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

	// **************************** Bill ****************************//

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

	@Transactional(propagation = Propagation.REQUIRED)
	public double calcBillAmt(Bill bill) {
		double billAmt = 0;

		Set<Transaction> transForFromBill = bill.getTransForFromBill();
		for (Transaction tran : transForFromBill) {
			billAmt += tran.getAmount();
		}

		Set<Transaction> transForToBill = bill.getTransForToBill();
		for (Transaction tran : transForToBill) {
			billAmt -= tran.getAmount();
		}

		if (bill.getAccount().getType() == Account.Type.CASH.type) {
			billAmt = billAmt * -1;
		}
		return billAmt;
	}
}
