package com.expense.mvc.model.ui;

import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;

import com.expense.mvc.model.entity.Bill;
import com.expense.utils.FU;

public class BillMinUI {
	private int id;
	private String name;
	private AccountMinUI account;
	private Date billDt;

	public BillMinUI() {
	}

	public BillMinUI(Bill bill) {
		id = bill.getBillId();
		account = new AccountMinUI(bill.getAccount());
		billDt = bill.getBillDt();
		name = account.getName() + " : " + FU.df(FU.DATE.yyyyMMdd).format(billDt) + " #" + id;
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

	public AccountMinUI getAccount() {
		return account;
	}

	public void setAccount(AccountMinUI account) {
		this.account = account;
	}

	public Date getBillDt() {
		return billDt;
	}

	public void setBillDt(Date billDt) {
		this.billDt = billDt;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
