package com.expense.mvc.model.ui;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class BillPayUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private CityUI city = null;
	private BillUI bill = null;
	private AccountMinUI account;
	private String paidDt;

	public CityUI getCity() {
		return city;
	}

	public void setCity(CityUI city) {
		this.city = city;
	}

	public BillUI getBill() {
		return bill;
	}

	public void setBill(BillUI bill) {
		this.bill = bill;
	}

	public AccountMinUI getAccount() {
		return account;
	}

	public void setAccount(AccountMinUI account) {
		this.account = account;
	}

	public String getPaidDt() {
		return paidDt;
	}

	public void setPaidDt(String paidDt) {
		this.paidDt = paidDt;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
