package com.expense.mvc.model.ui;

import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.time.DateUtils;

import com.expense.mvc.model.entity.Bill;
import com.expense.utils.FU;
import com.expense.utils.Props;

public class BillUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private int id;
	private String name;
	private AccountUI account;
	private Date createdDt;
	private Date billDt;
	private Date dueDt;

	private double billAmt;
	private double billBalance;
	private Date billPaidDt;
	private char status;

	private boolean dueDateWarning = false;

	public BillUI() {
	}

	public BillUI(Bill bill) {
		id = bill.getBillId();
		account = new AccountUI(bill.getAccount());
		createdDt = bill.getCreatedDt();
		billDt = bill.getBillDt();
		dueDt = bill.getDueDt();
		billAmt = bill.getBillAmt();
		billBalance = bill.getBillBalance();
		billPaidDt = bill.getBillPaidDt();
		status = bill.getStatus();

		buildName();
		checkDueDateWarning();
	}

	public void buildName() {
		name = FU.date(FU.Date.yyyyMMMdd).format(billDt) + " - #" + id;
	}

	private void checkDueDateWarning() {
		if (this.billBalance > 0 && this.dueDt != null) {
			int DUE_DATE_WARNING = Integer.valueOf(Props.expense.getString("DUE.DATE.WARNING"));
			Date now = Calendar.getInstance().getTime();
			now = DateUtils.addDays(now, DUE_DATE_WARNING);

			if (DateUtils.truncatedCompareTo(dueDt, now, Calendar.DATE) <= 0) {
				setDueDateWarning(true);
			}
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

	public AccountUI getAccount() {
		return account;
	}

	public void setAccount(AccountUI account) {
		this.account = account;
	}

	public Date getCreatedDt() {
		return createdDt;
	}

	public void setCreatedDt(Date createdDt) {
		this.createdDt = createdDt;
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

	public boolean isDueDateWarning() {
		return dueDateWarning;
	}

	public void setDueDateWarning(boolean dueDateWarning) {
		this.dueDateWarning = dueDateWarning;
	}

	public char getStatus() {
		return status;
	}

	public void setStatus(char status) {
		this.status = status;
	}

	public boolean isOpen() {
		return (status == Bill.Status.OPEN.status);
	}

	public boolean isPaid() {
		return (billBalance == 0);
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}