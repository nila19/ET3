package com.expense.mvc.model.ui;

import org.apache.commons.lang3.builder.ToStringBuilder;

import com.expense.mvc.model.entity.Account;

public class AccountMinUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	protected int id;
	protected String name = "";
	private char type;
	private char status;
	private char billOption;

	public AccountMinUI() {
	}

	public AccountMinUI(Account ac) {
		id = ac.getAccountId();
		name = ac.getDescription();
		status = ac.getStatus();
		type = ac.getType();
		billOption = ac.getBillOption();
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

	public boolean isActive() {
		return (this.status == Account.Status.ACTIVE.status);
	}

	public boolean isBilled() {
		return (this.billOption == Account.BillOption.YES.billOption);
	}

	public boolean isCash() {
		return (this.type == Account.Type.CASH.type);
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
