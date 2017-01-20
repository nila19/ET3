package com.expense.mvc.model.ui;

import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.time.DateUtils;

import com.expense.mvc.model.entity.Account;
import com.expense.mvc.model.entity.Bill;
import com.expense.mvc.model.entity.Transaction;
import com.expense.utils.Props;
import com.expense.utils.Utils;

public class AccountUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private int id;
	private String name = "";
	private double tallyBalance;
	private Date tallyDate;
	private double tallyExpenseAmt;
	private int tallyExpenseCnt;
	private double balanceAmt;
	private char type;
	private String imageCode;
	private char status;

	private char billOption;
	private int closingDay;
	private int dueDay;

	// Bill Information
	private boolean dueDtWarning = false;
	private Date billDt;
	private Date dueDt;
	private double billAmt;
	private double billBalance;
	private Date billPaidDt;
	private double openBillAmt;

	public AccountUI() {
	}

	public AccountUI(Account ac) {
		Utils.copyBean(this, ac);

		setId(ac.getAccountId());
		setName(ac.getDescription());
		setTallyExpenses(ac);
		setBillInfo(ac);
	}

	private void setBillInfo(Account ac) {
		if (ac.getLastBill() != null) {
			Bill bill = ac.getLastBill();

			setBillDt(bill.getBillDt());
			setDueDt(bill.getDueDt());
			setBillAmt(bill.getBillAmt());
			setBillBalance(bill.getBillBalance());
			setBillPaidDt(bill.getBillPaidDt());

			checkDueDateWarning(bill);
		}

		if (ac.getOpenBill() != null) {
			setOpenBillAmt(ac.getOpenBill().getBillBalance());
		}
	}

	private void checkDueDateWarning(Bill lastBill) {
		if (lastBill.getBillBalance() > 0) {
			Date dueDt = lastBill.getDueDt();

			int DUE_DATE_WARNING = Integer.valueOf(Props.expense.getString("DUE.DATE.WARNING"));
			Date now = Calendar.getInstance().getTime();
			now = DateUtils.addDays(now, DUE_DATE_WARNING);

			if (DateUtils.truncatedCompareTo(dueDt, now, Calendar.DATE) <= 0) {
				setDueDtWarning(true);
			}
		}
	}

	private void setTallyExpenses(Account ac) {
		tallyExpenseCnt = 0;
		tallyExpenseAmt = 0;
		for (Transaction t : ac.getTransForFromAccount()) {
			if (!t.isTallied()) {
				tallyExpenseCnt++;
				tallyExpenseAmt += t.getAmount();
			}
		}
		for (Transaction t : ac.getTransForToAccount()) {
			if (!t.isTallied()) {
				tallyExpenseCnt++;
				tallyExpenseAmt -= t.getAmount();
			}
		}

		if (tallyExpenseAmt != 0 && ac.getType() == Account.Type.CASH.type) {
			tallyExpenseAmt = tallyExpenseAmt * -1;
		}
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getBalanceAmt() {
		return balanceAmt;
	}

	public void setBalanceAmt(double balanceAmt) {
		this.balanceAmt = balanceAmt;
	}

	public double getTallyBalance() {
		return tallyBalance;
	}

	public void setTallyBalance(double tallyBalance) {
		this.tallyBalance = tallyBalance;
	}

	public Date getTallyDate() {
		return tallyDate;
	}

	public void setTallyDate(Date tallyDate) {
		this.tallyDate = tallyDate;
	}

	public double getTallyExpenseAmt() {
		return tallyExpenseAmt;
	}

	public void setTallyExpenseAmt(double tallyExpenseAmt) {
		this.tallyExpenseAmt = tallyExpenseAmt;
	}

	public int getTallyExpenseCnt() {
		return tallyExpenseCnt;
	}

	public void setTallyExpenseCnt(int tallyExpenseCnt) {
		this.tallyExpenseCnt = tallyExpenseCnt;
	}

	public char getType() {
		return type;
	}

	public void setType(char type) {
		this.type = type;
	}

	public String getImageCode() {
		return imageCode;
	}

	public void setImageCode(String imageCode) {
		this.imageCode = imageCode;
	}

	public char getStatus() {
		return status;
	}

	public void setStatus(char status) {
		this.status = status;
	}

	public char getBillOption() {
		return billOption;
	}

	public void setBillOption(char billOption) {
		this.billOption = billOption;
	}

	public int getClosingDay() {
		return closingDay;
	}

	public void setClosingDay(Integer closingDay) {
		this.closingDay = closingDay == null ? 0 : closingDay;
	}

	public int getDueDay() {
		return dueDay;
	}

	public void setDueDay(Integer dueDay) {
		this.dueDay = dueDay == null ? 0 : dueDay;
	}

	public boolean isActive() {
		return status == Account.Status.ACTIVE.status;
	}

	public boolean isBilled() {
		return billOption == Account.BillOption.YES.billOption;
	}

	public boolean isCash() {
		return type == Account.Type.CASH.type;
	}

	public boolean isDueDtWarning() {
		return dueDtWarning;
	}

	public void setDueDtWarning(boolean dueDtWarning) {
		this.dueDtWarning = dueDtWarning;
	}

	public Date getBillDt() {
		return billDt;
	}

	public void setBillDt(Date billDt) {
		this.billDt = billDt;
	}

	public Date getDueDt() {
		return dueDt;
	}

	public void setDueDt(Date dueDt) {
		this.dueDt = dueDt;
	}

	public double getBillAmt() {
		return billAmt;
	}

	public void setBillAmt(double billAmt) {
		this.billAmt = billAmt;
	}

	public double getBillBalance() {
		return billBalance;
	}

	public void setBillBalance(double billBalance) {
		this.billBalance = billBalance;
	}

	public Date getBillPaidDt() {
		return billPaidDt;
	}

	public void setBillPaidDt(Date billPaidDt) {
		this.billPaidDt = billPaidDt;
	}

	public double getOpenBillAmt() {
		return openBillAmt;
	}

	public void setOpenBillAmt(double openBillAmt) {
		this.openBillAmt = openBillAmt;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
