package com.expense.mvc.service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang3.text.WordUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.expense.mvc.model.dao.AccountDAO;
import com.expense.mvc.model.dao.BillDAO;
import com.expense.mvc.model.dao.CategoryDAO;
import com.expense.mvc.model.dao.TransactionDAO;
import com.expense.mvc.model.entity.Account;
import com.expense.mvc.model.entity.Bill;
import com.expense.mvc.model.entity.Transaction;
import com.expense.mvc.model.ui.AccountMinUI;
import com.expense.mvc.model.ui.BillPayUI;
import com.expense.mvc.model.ui.BillUI;
import com.expense.mvc.model.ui.CategoryUI;
import com.expense.mvc.model.ui.SwapUI;
import com.expense.mvc.model.ui.TransMinUI;
import com.expense.mvc.model.ui.TransactionUI;
import com.expense.utils.FU;

@Service
public class EntryService {

	@Autowired
	private AccountDAO accountDAO;

	@Autowired
	private CategoryDAO categoryDAO;

	@Autowired
	private TransactionDAO transactionDAO;

	@Autowired
	private BillDAO billDAO;

	@Transactional(propagation = Propagation.REQUIRED)
	public TransMinUI addExpense(TransactionUI ui) {
		Transaction t = new Transaction();
		t.setEntryDate(new java.sql.Timestamp((new Date()).getTime()));
		t.setEntryMonth(new java.sql.Date(DateUtils.truncate(new Date(), Calendar.MONTH).getTime()));
		t.setTallyInd(Transaction.Tally.NO.status);
		t.setStatus(Transaction.Status.POSTED.status);
		copyTransFields(ui, t);

		Account fr = t.getFromAccount();
		Account to = t.getToAccount();

		Account dkAcc = (ui.getFromAccount() != null && ui.getFromAccount().getId() > 0) ? fr : to;
		t.setDataKey(dkAcc.getDataKey());

		if (fr.doesBills() && fr.getOpenBill() != null) {
			t.setFromBill(fr.getOpenBill());
		}
		if (to.doesBills() && to.getOpenBill() != null) {
			t.setToBill(to.getOpenBill());
		}

		transactionDAO.save(t);

		DecimalFormat df = FU.nf(FU.NUMBER.NOCOMMA);

		// Set From/To accounts' 'BEFORE' balances before cash movement.
		if (fr.getAccountId() != 0) {
			t.setFromBalanceBf(Double.valueOf(df.format(fr.getBalanceAmt())));
		}
		if (to.getAccountId() != 0) {
			t.setToBalanceBf(Double.valueOf(df.format(to.getBalanceAmt())));
		}

		moveCash(t, t.getAmount());

		// Set From/To accounts' 'AFTER' balances after cash movement.
		if (fr.getAccountId() != 0) {
			t.setFromBalanceAf(Double.valueOf(df.format(fr.getBalanceAmt())));
		}
		if (to.getAccountId() != 0) {
			t.setToBalanceAf(Double.valueOf(df.format(to.getBalanceAmt())));
		}

		t.setTransSeq(t.getTransId());
		transactionDAO.save(t);
		return new TransMinUI(t.getTransId());
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public boolean modifyExpense(TransactionUI ui) {
		Transaction t = transactionDAO.findById(ui.getId());
		Account from = t.getFromAccount();
		Account to = t.getToAccount();

		// Financial Impact - Identify if there is any change in Amount or Accounts.
		// Check Amount / FromAccount / ToAccount has changed.
		boolean finImpact = false;
		if (t.getAmount() != ui.getAmount() || from.getAccountId() != ui.getFromAccount().getId()
				|| (ui.isAdjust() && to.getAccountId() != ui.getToAccount().getId())) {
			finImpact = true;
		}

		// If Financial Impact : for ADJUST both Accounts should be Active, else
		// just FromAccount should be Active.
		if (finImpact) {
			if (t.getAdjustInd() == Transaction.Adjust.YES.type) {
				if (from.getAccountId() != 0 && !from.isActive()) {
					return false;
				}
				if (to.getAccountId() != 0 && !to.isActive()) {
					return false;
				}
			} else if ((t.getAdjustInd() == Transaction.Adjust.NO.type) && !from.isActive()) {
				return false;
			}
		}

		// Move Cash only if there is any Financial impact.
		// Reverse the previous cash movement.
		if (finImpact) {
			t.setTallyInd(Transaction.Tally.NO.status);
			moveCash(t, t.getAmount() * -1);
		}

		copyTransFields(ui, t);
		transactionDAO.save(t);

		// Move Cash only if there is any Financial impact.
		if (finImpact) {
			moveCash(t, t.getAmount());
			// Fix the From/To Before/After amounts.
			adjustTransBalances(t);
		}
		return true;
	}

	// Find previous trans for the same Fr/To accounts to get the Ac balance at
	// that time period.
	private void adjustTransBalances(Transaction t) {
		// Setting FromAccount Bf/Af balances
		int fr = t.getFromAccount().getAccountId();
		if (fr == 0) {
			t.setFromBalanceBf(0);
			t.setFromBalanceAf(0);
		} else {
			List<Transaction> allFr = transactionDAO.findByAccount(t.getDataKey(), fr, false, 0);
			for (Transaction t2 : allFr) {
				if (t2.getTransSeq() < t.getTransSeq()) {
					if (fr == t2.getFromAccount().getAccountId()) {
						t.setFromBalanceBf(t2.getFromBalanceAf());
					}
					if (fr == t2.getToAccount().getAccountId()) {
						t.setFromBalanceBf(t2.getToBalanceAf());
					}
					double transamt = (t.getFromAccount().getType() == Account.Type.CASH.type) ? t.getAmount()
							: t.getAmount() * -1;
					t.setFromBalanceAf(t.getFromBalanceBf() - transamt);
					break;
				}
			}
		}

		// Setting ToAccount Bf/Af balances
		int to = t.getToAccount().getAccountId();
		if (to == 0) {
			t.setToBalanceBf(0);
			t.setToBalanceAf(0);
		} else {
			List<Transaction> allTo = transactionDAO.findByAccount(t.getDataKey(), to, false, 0);
			for (Transaction t2 : allTo) {
				if (t2.getTransSeq() < t.getTransSeq()) {
					if (to == t2.getFromAccount().getAccountId()) {
						t.setToBalanceBf(t2.getFromBalanceAf());
					}
					if (to == t2.getToAccount().getAccountId()) {
						t.setToBalanceBf(t2.getToBalanceAf());
					}
					double transamt = (t.getToAccount().getType() == Account.Type.CASH.type) ? t.getAmount()
							: t.getAmount() * -1;
					t.setToBalanceAf(t.getToBalanceBf() + transamt);
					break;
				}
			}
		}

		transactionDAO.save(t);
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public void deleteExpense(int transId) {
		Transaction t = transactionDAO.findById(transId);

		// Reverse the previous cash movement.
		moveCash(t, t.getAmount() * -1);

		if (t.getFromAccount().getAccountId() != 0) {
			t.getFromAccount().getTransForFromAccount().remove(t);
		}
		if (t.getToAccount().getAccountId() != 0) {
			t.getToAccount().getTransForToAccount().remove(t);
		}

		// TODO If bill is already closed, bill-balance is not getting adjusted...
		transactionDAO.delete(t);
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public TransactionUI getTransaction(int transId) {
		Transaction t = transactionDAO.findById(transId);
		return new TransactionUI(t);
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public BillUI getBill(int billId) {
		Bill b = billDAO.findById(billId);
		return new BillUI(b);
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<BillUI> getBills(int city, int accId, boolean open) {
		List<Bill> bills = accId == 0 ? billDAO.findAll(city, open) : billDAO.findForAcct(accId, open);

		List<BillUI> uis = new ArrayList<BillUI>();
		for (Bill bill : bills) {
			// Open Bills do not have bill amt & balance populated.
			if (bill.isOpen()) {
				double amt = BillCloser.calcBillAmt(bill);
				bill.setBillAmt(amt);
				bill.setBillBalance(amt);
			}
			uis.add(new BillUI(bill));
		}
		return uis;
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<BillUI> getAllBillsforAccount(int accId) {
		List<Bill> bills = billDAO.findForAcct(accId);

		List<BillUI> uis = new ArrayList<BillUI>();
		for (Bill bill : bills) {
			// Open Bills do not have bill amt & balance populated.
			if (bill.isOpen()) {
				double amt = BillCloser.calcBillAmt(bill);
				bill.setBillAmt(amt);
				bill.setBillBalance(amt);
			}
			uis.add(new BillUI(bill));
		}
		return uis;
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public TransMinUI payBill(BillPayUI bpui) {
		Bill bill = billDAO.findById(bpui.getBill().getId());

		TransactionUI ui = new TransactionUI();
		ui.setFromAccount(bpui.getAccount());
		ui.setToAccount(new AccountMinUI(bill.getAccount()));
		ui.setTransDate(bpui.getPaidDt());
		ui.setCategory(new CategoryUI());
		ui.getCategory().setId(0);
		ui.setDescription("CC Bill Payment");
		ui.setAmount(bill.getBillBalance());
		ui.setAdjust(true);
		ui.setAdhoc(false);

		TransMinUI tui = addExpense(ui);
		Transaction t = transactionDAO.findById(tui.getId());
		t.setToBill(bill);
		transactionDAO.save(t);

		double bal = bill.getBillBalance() - t.getAmount();
		if (bal > -0.01 && bal < 0.01) {
			bal = 0;
		}
		bill.setBillBalance(bal);
		bill.setBillPaidDt(t.getTransDate());
		bill.setPayTran(t);
		billDAO.save(bill);

		return tui;
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public void swapSequence(SwapUI[] uis) {
		for (SwapUI ui : uis) {
			processSwap(ui.getFromTrans(), ui.getToTrans());
		}
	}

	private void processSwap(int transId_1, int transId_2) {
		Transaction t1 = transactionDAO.findById(transId_1);
		Transaction t2 = transactionDAO.findById(transId_2);

		int seq1 = t1.getTransSeq();
		int seq2 = t2.getTransSeq();

		// Always Oldest trans first.
		if (seq1 < seq2) {
			adjustBalances(t1, t2);
		} else {
			adjustBalances(t2, t1);
		}

		t1.setTransSeq(seq2);
		t2.setTransSeq(seq1);

		transactionDAO.save(t1);
		transactionDAO.save(t2);
	}

	private void adjustBalances(Transaction t1, Transaction t2) {
		HashMap<Integer, Double> bf = new HashMap<Integer, Double>();
		HashMap<Integer, Double> af = new HashMap<Integer, Double>();

		int t1fr = t1.getFromAccount().getAccountId();
		int t1to = t1.getToAccount().getAccountId();
		int t2fr = t2.getFromAccount().getAccountId();
		int t2to = t2.getToAccount().getAccountId();

		bf.put(t1fr, t1.getFromBalanceBf());
		af.put(t1fr, t1.getFromBalanceAf());
		bf.put(t1to, t1.getToBalanceBf());
		af.put(t1to, t1.getToBalanceAf());
		bf.put(t2fr, t2.getFromBalanceBf());
		af.put(t2fr, t2.getFromBalanceAf());
		bf.put(t2to, t2.getToBalanceBf());
		af.put(t2to, t2.getToBalanceAf());

		// Reverse the trans. #2 is the latest one.
		replayTrans(bf, af, t2, true);
		replayTrans(bf, af, t1, true);

		// Redo the trans from the reverse order.
		replayTrans(bf, af, t2, false);

		t2.setFromBalanceBf(bf.get(t2fr));
		t2.setFromBalanceAf(af.get(t2fr));
		t2.setToBalanceBf(bf.get(t2to));
		t2.setToBalanceAf(af.get(t2to));

		replayTrans(bf, af, t1, false);

		t1.setFromBalanceBf(bf.get(t1fr));
		t1.setFromBalanceAf(af.get(t1fr));
		t1.setToBalanceBf(bf.get(t1to));
		t1.setToBalanceAf(af.get(t1to));
	}

	private void replayTrans(HashMap<Integer, Double> bf, HashMap<Integer, Double> af, Transaction t, boolean reverse) {
		Account a1 = t.getFromAccount();
		Account a2 = t.getToAccount();

		double amt = reverse ? t.getAmount() * -1 : t.getAmount();

		if (a1.getAccountId() != 0) {
			double bf_amt = bf.get(a1.getAccountId());
			bf_amt = (a1.getType() == Account.Type.CASH.type) ? bf_amt - amt : bf_amt + amt;
			bf.put(a1.getAccountId(), bf_amt);

			double af_amt = af.get(a1.getAccountId());
			af_amt = (a1.getType() == Account.Type.CASH.type) ? af_amt - amt : af_amt + amt;
			af.put(a1.getAccountId(), af_amt);
		}

		if (a2.getAccountId() != 0) {
			double bf_amt = af.get(a2.getAccountId());
			bf_amt = (a2.getType() == Account.Type.CASH.type) ? bf_amt + amt : bf_amt - amt;
			af.put(a2.getAccountId(), bf_amt);

			double af_amt = af.get(a2.getAccountId());
			af_amt = (a2.getType() == Account.Type.CASH.type) ? af_amt + amt : af_amt - amt;
			af.put(a2.getAccountId(), af_amt);
		}
	}

	// ********************************************************************************************
	// ************************************** Common Methods
	// **************************************

	private void copyTransFields(TransactionUI ui, Transaction t) {
		t.setTransDate(new java.sql.Date(ui.getTransDate().getTime()));
		t.setTransMonth(new java.sql.Date(DateUtils.truncate(ui.getTransDate(), Calendar.MONTH).getTime()));
		t.setDescription(WordUtils.capitalize(ui.getDescription()));
		t.setAmount(ui.getAmount());
		t.setAdjustInd(ui.isAdjust() ? 'Y' : 'N');
		t.setAdhocInd(ui.isAdhoc() ? 'Y' : 'N');
		t.setCategory(categoryDAO.findById(ui.getCategory() != null ? ui.getCategory().getId() : 0));
		t.setFromAccount(accountDAO.findById(ui.getFromAccount() != null ? ui.getFromAccount().getId() : 0));
		t.setToAccount(accountDAO.findById(ui.getToAccount() != null ? ui.getToAccount().getId() : 0));

		if (ui.getBill() != null) {
			t.setFromBill(t.getFromAccount().doesBills() ? billDAO.findById(ui.getBill().getId()) : null);
		}
		// TODO If bill is already closed, bill-balance is not getting adjusted...
	}

	private void moveCash(Transaction t, double amount) {
		if (t.getFromAccount().getAccountId() != 0) {
			updateAccount(t.getFromAccount(), amount * -1, t);
		}
		if (t.getToAccount().getAccountId() != 0) {
			updateAccount(t.getToAccount(), amount, t);
		}
	}

	private void updateAccount(Account ac, double amount, Transaction t) {
		if (ac.getType() == Account.Type.CREDIT.type) {
			amount = amount * -1;
		}

		ac.setBalanceAmt(Double.valueOf(FU.nf(FU.NUMBER.NOCOMMA).format(ac.getBalanceAmt() + amount)));
		accountDAO.save(ac);

		// Find all future trans post this & adjust the ac balance.
		// If Seq = null, it is an ADD. Don't do this for ADD, as Add does not
		// have future trans.
		if (t.getTransSeq() != null) {
			updateTransItemBalances(ac, amount, t);
		}
	}

	private void updateTransItemBalances(Account ac, double amount, Transaction t) {
		for (Transaction ft : ac.getTransForFromAccount()) {
			if (ft.getTransSeq() >= t.getTransSeq()) {
				ft.setFromBalanceBf(ft.getFromBalanceBf() + amount);
				ft.setFromBalanceAf(ft.getFromBalanceAf() + amount);
				transactionDAO.save(ft);
			}
		}
		for (Transaction ft : ac.getTransForToAccount()) {
			if (ft.getTransSeq() >= t.getTransSeq()) {
				ft.setToBalanceBf(ft.getToBalanceBf() + amount);
				ft.setToBalanceAf(ft.getToBalanceAf() + amount);
				transactionDAO.save(ft);
			}
		}
	}
}
