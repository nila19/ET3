package com.expense.mvc.model.ui;

import java.text.ParseException;
import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;

import com.expense.utils.FU;

public class BillPayUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private int billId;
	private AccountUI account;
	private String paidDt;
	private Date dtPaidDt;

	public int getBillId() {
		return billId;
	}

	public void setBillId(int billId) {
		this.billId = billId;
	}

	public AccountUI getAccount() {
		return account;
	}

	public void setAccount(AccountUI account) {
		this.account = account;
	}

	public String getPaidDt() {
		return paidDt;
	}

	public void setPaidDt(String paidDt) {
		this.paidDt = paidDt;
	}

	public Date getDtPaidDt() {
		try {
			return FU.date(FU.Date.ddMMMyy).parse(paidDt);
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
