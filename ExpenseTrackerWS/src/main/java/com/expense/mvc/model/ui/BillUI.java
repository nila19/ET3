package com.expense.mvc.model.ui;

import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.time.DateUtils;

import com.expense.mvc.model.entity.Bill;
import com.expense.utils.FU;

public class BillUI extends BillMinUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private Date createdDt;
	private Date dueDt;

	private double billAmt;
	private double billBalance;
	private Date billPaidDt;
	private char status;

	private boolean dueDateWarning = false;

	public BillUI() {
		super();
	}

	public BillUI(Bill bill) {
		super(bill);
		createdDt = bill.getCreatedDt();
		dueDt = bill.getDueDt();
		billAmt = bill.getBillAmt();
		billBalance = bill.getBillBalance();
		billPaidDt = bill.getBillPaidDt();
		status = bill.getStatus();

		checkDueDateWarning();
	}

	private void checkDueDateWarning() {
		if (this.billBalance > 0 && this.dueDt != null) {
			int DUE_DATE_WARNING = Integer.valueOf(FU.expense.getString("DUE.DATE.WARNING"));
			Date now = Calendar.getInstance().getTime();
			now = DateUtils.addDays(now, DUE_DATE_WARNING);

			if (DateUtils.truncatedCompareTo(dueDt, now, Calendar.DATE) <= 0) {
				setDueDateWarning(true);
			}
		}
	}

	public Date getCreatedDt() {
		return createdDt;
	}

	public void setCreatedDt(Date createdDt) {
		this.createdDt = createdDt;
	}

	public Date getDueDt() {
		return dueDt;
	}

	public void setDueDt(Date dueDt) {
		this.dueDt = dueDt;
	}

	public double getBillAmt() {
		return FU.toAmount(billAmt);
	}

	public void setBillAmt(double billAmt) {
		this.billAmt = billAmt;
	}

	public double getBillBalance() {
		return FU.toAmount(billBalance);
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