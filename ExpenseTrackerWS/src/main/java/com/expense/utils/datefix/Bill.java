package com.expense.utils.datefix;

import java.sql.Date;
import java.sql.Timestamp;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class Bill {
	private int id = 0;
	private Timestamp createdDate;
	private Date billDate;
	private Date dueDate;
	private Date paidDate;

	private String createdDateOld;
	private String billDateOld;
	private String dueDateOld;
	private String paidDateOld;

	private String createdDateNew;
	private String billDateNew;
	private String dueDateNew;
	private String paidDateNew;

	private boolean match;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Timestamp getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Timestamp createdDate) {
		this.createdDate = createdDate;
	}

	public Date getBillDate() {
		return billDate;
	}

	public void setBillDate(Date billDate) {
		this.billDate = billDate;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}

	public Date getPaidDate() {
		return paidDate;
	}

	public void setPaidDate(Date paidDate) {
		this.paidDate = paidDate;
	}

	public String getCreatedDateOld() {
		return createdDateOld;
	}

	public void setCreatedDateOld(String createdDateOld) {
		this.createdDateOld = createdDateOld;
	}

	public String getBillDateOld() {
		return billDateOld;
	}

	public void setBillDateOld(String billDateOld) {
		this.billDateOld = billDateOld;
	}

	public String getDueDateOld() {
		return dueDateOld;
	}

	public void setDueDateOld(String dueDateOld) {
		this.dueDateOld = dueDateOld;
	}

	public String getPaidDateOld() {
		return paidDateOld;
	}

	public void setPaidDateOld(String paidDateOld) {
		this.paidDateOld = paidDateOld;
	}

	public String getCreatedDateNew() {
		return createdDateNew;
	}

	public void setCreatedDateNew(String createdDateNew) {
		this.createdDateNew = createdDateNew;
	}

	public String getBillDateNew() {
		return billDateNew;
	}

	public void setBillDateNew(String billDateNew) {
		this.billDateNew = billDateNew;
	}

	public String getDueDateNew() {
		return dueDateNew;
	}

	public void setDueDateNew(String dueDateNew) {
		this.dueDateNew = dueDateNew;
	}

	public String getPaidDateNew() {
		return paidDateNew;
	}

	public void setPaidDateNew(String paidDateNew) {
		this.paidDateNew = paidDateNew;
	}

	public boolean isMatch() {
		match = StringUtils.equalsIgnoreCase(createdDateOld, createdDateNew)
				&& StringUtils.equalsIgnoreCase(billDateOld, billDateNew)
				&& StringUtils.equalsIgnoreCase(dueDateOld, dueDateNew)
				&& StringUtils.equalsIgnoreCase(paidDateOld, paidDateNew);
		return match;
	}

	public void setMatch(boolean match) {
		this.match = match;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
