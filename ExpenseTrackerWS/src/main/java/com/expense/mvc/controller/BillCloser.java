package com.expense.mvc.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.time.DateUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.expense.mvc.model.entity.Account;
import com.expense.mvc.model.entity.Bill;
import com.expense.mvc.model.ui.AccountUI;
import com.expense.mvc.model.ui.BillUI;
import com.expense.mvc.service.BillService;
import com.expense.mvc.service.StartupService;

public class BillCloser {
	private static final Logger logger = LogManager.getLogger("log." + BillCloser.class);

	@Autowired
	private StartupService ss;

	@Autowired
	private BillService bs;

	private int dataKey = 0;

	@Transactional(propagation = Propagation.REQUIRED)
	public void init() {
		BillCloser.logger.info("BillCloser started...");
		int billsClosed = 0;
		int billsOpened = 0;
		try {
			dataKey = ss.getDefaultDataKey().getId();
			billsClosed = closeAllOpenBills();
			billsOpened = createAllOpenBills();
		} catch (Exception e) {
			BillCloser.logger.error("BillCloser errored out... ", e);
		} finally {
			BillCloser.logger.info("BillCloser ended... CLOSED = " + billsClosed + " :: OPENED = " + billsOpened);
		}
	}

	@Transactional(propagation = Propagation.REQUIRED)
	private int closeAllOpenBills() {
		int billsClosed = 0;
		Date today = Calendar.getInstance().getTime();

		List<BillUI> openBills = bs.getAllOpenBills(dataKey);
		for (BillUI billUI : openBills) {
			if (DateUtils.truncatedCompareTo(billUI.getBillDt(), today, Calendar.DATE) < 0) {
				closeBill(billUI);
				billsClosed++;
			}
		}
		return billsClosed;
	}

	@Transactional(propagation = Propagation.REQUIRED)
	private void closeBill(BillUI billUI) {
		Bill bill = bs.getBill(dataKey, billUI.getId());
		double billAmt = bs.calcBillAmt(bill);

		bill.setBillAmt(billAmt);
		bill.setBillBalance(billAmt);
		bill.setStatus(Bill.Status.CLOSED.status);
		bs.saveBill(bill);

		Account ac = bill.getAccount();
		ac.setLastBill(bill);
		bs.saveAccount(ac);
	}

	@Transactional(propagation = Propagation.REQUIRED)
	private int createAllOpenBills() {
		int billsOpened = 0;

		List<AccountUI> accounts = ss.getAllActiveAccounts(dataKey);
		for (AccountUI ui : accounts) {
			if (ui.isBilled()) {
				Account ac = bs.getAccount(ui.getId());
				if (ac.getOpenBill() == null || !ac.getOpenBill().isOpen()) {
					Bill openBill = createOpenBill(ac);
					bs.saveBill(openBill);
					ac.setOpenBill(openBill);
					bs.saveAccount(ac);

					billsOpened++;
				}
			}
		}
		return billsOpened;
	}

	@Transactional(propagation = Propagation.REQUIRED)
	private Bill createOpenBill(Account ac) {
		Date now = Calendar.getInstance().getTime();

		Bill newBill = new Bill();
		newBill.setDataKey(dataKey);
		newBill.setAccount(ac);
		newBill.setCreatedDt(new java.sql.Timestamp(now.getTime()));

		int billDay = ac.getClosingDay();
		Date billDt = DateUtils.setDays(now, billDay);
		if (DateUtils.truncatedCompareTo(billDt, now, Calendar.DATE) <= 0) {
			billDt = DateUtils.addMonths(billDt, 1);
		}
		newBill.setBillDt(new java.sql.Date(billDt.getTime()));

		int dueDay = ac.getDueDay();
		Date dueDt = DateUtils.setDays(billDt, dueDay);
		if (DateUtils.truncatedCompareTo(dueDt, billDt, Calendar.DATE) <= 0) {
			dueDt = DateUtils.addMonths(dueDt, 1);
		}
		newBill.setDueDt(new java.sql.Date(dueDt.getTime()));

		newBill.setBillAmt((double) 0);
		newBill.setBillBalance((double) 0);
		newBill.setStatus(Bill.Status.OPEN.status);
		return newBill;
	}
}
