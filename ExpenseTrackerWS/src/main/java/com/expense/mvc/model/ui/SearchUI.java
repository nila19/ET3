package com.expense.mvc.model.ui;

import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class SearchUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private int city;

	private int categoryId;
	private String description = "";
	private double amount;
	private long transMonth;
	private boolean transMonthAggr;
	private long entryMonth;
	private boolean entryMonthAggr;
	private Date dtTransMonth;
	private Date dtEntryMonth;
	private int accountId;
	private int billId;
	private char adjustInd;
	private char adhocInd;
	private boolean thinList = true;

	public int getCity() {
		return city;
	}

	public void setCity(int city) {
		this.city = city;
	}

	public int getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public long getTransMonth() {
		return transMonth;
	}

	public void setTransMonth(long transMonth) {
		this.transMonth = transMonth;
		this.dtTransMonth = new Date(this.transMonth);
	}

	public boolean isTransMonthAggr() {
		return transMonthAggr;
	}

	public void setTransMonthAggr(boolean transMonthAggr) {
		this.transMonthAggr = transMonthAggr;
	}

	public long getEntryMonth() {
		return entryMonth;
	}

	public void setEntryMonth(long entryMonth) {
		this.entryMonth = entryMonth;
		this.dtEntryMonth = new Date(this.entryMonth);
	}

	public boolean isEntryMonthAggr() {
		return entryMonthAggr;
	}

	public void setEntryMonthAggr(boolean entryMonthAggr) {
		this.entryMonthAggr = entryMonthAggr;
	}

	public Date getDtTransMonth() {
		return dtTransMonth;
	}

	public void setDtTransMonth(Date dtTransMonth) {
		this.dtTransMonth = dtTransMonth;
	}

	public Date getDtEntryMonth() {
		return dtEntryMonth;
	}

	public void setDtEntryMonth(Date dtEntryMonth) {
		this.dtEntryMonth = dtEntryMonth;
	}

	public int getAccountId() {
		return accountId;
	}

	public void setAccountId(int accountId) {
		this.accountId = accountId;
	}

	public int getBillId() {
		return billId;
	}

	public void setBillId(int billId) {
		this.billId = billId;
	}

	public char getAdjustInd() {
		return adjustInd;
	}

	public void setAdjustInd(char adjustInd) {
		this.adjustInd = adjustInd;
	}

	public char getAdhocInd() {
		return adhocInd;
	}

	public void setAdhocInd(char adhocInd) {
		this.adhocInd = adhocInd;
	}

	public boolean isAdhoc() {
		return adhocInd == 'Y';
	}

	public void setAdhoc(boolean adhoc) {
		this.adhocInd = adhoc ? 'Y' : 'N';
	}

	public boolean isAdjust() {
		return adjustInd == 'Y';
	}

	public void setAdjust(boolean adjust) {
		this.adjustInd = adjust ? 'Y' : 'N';
	}

	public boolean isThinList() {
		return thinList;
	}

	public void setThinList(boolean thinList) {
		this.thinList = thinList;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
