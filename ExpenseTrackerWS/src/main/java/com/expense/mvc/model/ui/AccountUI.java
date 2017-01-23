package com.expense.mvc.model.ui;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.time.DateUtils;

import com.expense.mvc.model.entity.Account;
import com.expense.mvc.model.entity.Bill;
import com.expense.mvc.model.entity.Transaction;
import com.expense.utils.FU;
import com.expense.utils.Props;

public class AccountUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private int id;
	private String name = "";
	private double balanceAmt;
	private char type;
	private char status;
	private String imageCode;
	//TODO Add to DB.
	private String bgColor = "blue";
	private String icon = "account_balance";

	private char billOption;
	private int closingDay;
	private int dueDay;
	
	private double tallyBalance;
	private Date tallyDate;
	private double tallyExpenseAmt;
	private int tallyExpenseCnt;

	// Bill Information
	private Date billDt;
	private Date dueDt;
	private double billAmt;
	private double billBalance;
	private Date billPaidDt;
	private double unbilledAmt;
	private Date nextBillDt;

	//Flags
	private boolean tallyToday = false;
	private boolean billDue = false;
	private boolean dueDtWarning = false;

	public AccountUI() {
	}

	public AccountUI(Account ac) {
		id = ac.getAccountId();
		name = ac.getDescription();
		balanceAmt = ac.getBalanceAmt();
		status = ac.getStatus();
		type = ac.getType();
		imageCode = ac.getImageCode();
		billOption = ac.getBillOption();

		setClosingDay(ac.getClosingDay());
		setDueDay(ac.getDueDay());

		setTallyExpenses(ac);
		if(this.isBilled()) {
			setBillInfo(ac);
		}
	}

	private void setBillInfo(Account ac) {
		if (ac.getLastBill() != null) {
			Bill bill = ac.getLastBill();
			billDt = bill.getBillDt();
			dueDt = bill.getDueDt();
			billAmt = bill.getBillAmt();
			billBalance = bill.getBillBalance();
			billPaidDt = bill.getBillPaidDt();
			checkDueDateWarning(bill);
		}
		if (ac.getOpenBill() != null) {
			unbilledAmt = ac.getOpenBill().getBillBalance();
		}
		
		Date today = Calendar.getInstance().getTime();
		nextBillDt = DateUtils.setDays(today, closingDay);
		if (DateUtils.truncatedCompareTo(nextBillDt, today, Calendar.DATE) <= 0) {
			nextBillDt = DateUtils.addMonths(nextBillDt, 1);
		}
	}

	private void checkDueDateWarning(Bill lastBill) {
		if (lastBill.getBillBalance() > 0) {
			billDue = true;
			
			Date dueDt = lastBill.getDueDt();
			int DUE_DATE_WARNING = Integer.valueOf(Props.expense.getString("DUE.DATE.WARNING"));
			Date now = Calendar.getInstance().getTime();
			now = DateUtils.addDays(now, DUE_DATE_WARNING);
			if (DateUtils.truncatedCompareTo(dueDt, now, Calendar.DATE) <= 0) {
				dueDtWarning = true;
			}
		}
	}

	private void setTallyExpenses(Account ac) {
		tallyBalance = ac.getTallyBalance();
		tallyDate = ac.getTallyDate();
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
		if(tallyDate != null) {
			tallyToday = DateUtils.isSameDay(tallyDate, new Date());
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
		return FU.amt(balanceAmt);
	}

	public void setBalanceAmt(double balanceAmt) {
		this.balanceAmt = balanceAmt;
	}

	public double getTallyBalance() {
		return FU.amt(tallyBalance);
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
		return FU.amt(tallyExpenseAmt);
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

	public boolean isTallyToday() {
		return tallyToday;
	}

	public void setTallyToday(boolean tallyToday) {
		this.tallyToday = tallyToday;
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

	public String getBgColor() {
		return bgColor;
	}

	public void setBgColor(String bgColor) {
		this.bgColor = bgColor;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
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
		this.closingDay = (closingDay == null ? 0 : closingDay);
	}

	public int getDueDay() {
		return dueDay;
	}

	public void setDueDay(Integer dueDay) {
		this.dueDay = (dueDay == null ? 0 : dueDay);
	}

	public boolean isActive() {
		return (this.status == Account.Status.ACTIVE.status);
	}

	public boolean isBilled() {
		return (this.billOption == Account.BillOption.YES.billOption);
	}

	public boolean isCash() {
		return (this.type == Account.Type.CASH.type);
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
		return FU.amt(billAmt);
	}

	public void setBillAmt(double billAmt) {
		this.billAmt = billAmt;
	}

	public double getBillBalance() {
		return FU.amt(billBalance);
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

	public double getUnbilledAmt() {
		return FU.amt(unbilledAmt);
	}

	public void setUnbilledAmt(double unbilledAmt) {
		this.unbilledAmt = unbilledAmt;
	}

	public boolean isBillDue() {
		return billDue;
	}

	public void setBillDue(boolean billDue) {
		this.billDue = billDue;
	}

	public Date getNextBillDt() {
		return nextBillDt;
	}

	public void setNextBillDt(Date nextBillDt) {
		this.nextBillDt = nextBillDt;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
