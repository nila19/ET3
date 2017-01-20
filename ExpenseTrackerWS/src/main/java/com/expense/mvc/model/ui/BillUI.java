package com.expense.mvc.model.ui;

import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.time.DateUtils;

import com.expense.mvc.model.entity.Bill;
import com.expense.utils.FU;
import com.expense.utils.Props;
import com.expense.utils.Utils;

public class BillUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private int id;
	private String name;
	private int accountId;
	private String accountDesc;
	private Date createdDt;
	private Date billDt;
	private Date dueDt;

	private double billAmt;
	private double billBalance;
	private Date billPaidDt;

	private Character status;

	private boolean dueDateWarning = false;
	private boolean open = true;

	public BillUI() {
	}

	public BillUI(Bill bill) {
		Utils.copyBean(this, bill);
		setAccountId(bill.getAccount().getAccountId());
		setAccountDesc(bill.getAccount().getDescription());
		
		setName(this.getAccountDesc() + " - #" + this.getId());
		setOpen(this.status == Bill.Status.OPEN.status);

		checkDueDateWarning();
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

	public int getAccountId() {
		return accountId;
	}

	public void setAccountId(int accountId) {
		this.accountId = accountId;
	}

	public String getAccountDesc() {
		return accountDesc;
	}

	public void setAccountDesc(String accountDesc) {
		this.accountDesc = accountDesc;
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

	public boolean isDueDateWarning() {
		return dueDateWarning;
	}

	public void setDueDateWarning(boolean dueDateWarning) {
		this.dueDateWarning = dueDateWarning;
	}

	public Character getStatus() {
		return status;
	}

	public void setStatus(Character status) {
		this.status = status;
	}

	public boolean isOpen() {
		return open;
	}

	public void setOpen(boolean open) {
		this.open = open;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}