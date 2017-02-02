package com.expense.mvc.model.ui;

import java.text.ParseException;
import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.text.WordUtils;

import com.expense.mvc.model.entity.Transaction;
import com.expense.utils.FU;

public class TransactionUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private CityUI city = null;
	private int id = 0;
	private CategoryUI category;
	private String description = "";
	private double amount;
	private Date entryDate;
	private Date transDate;
	private Date tallyDate;

	private AccountUI fromAccount;
	private double fromBalanceBf;
	private double fromBalanceAf;
	private AccountUI toAccount;
	private double toBalanceBf;
	private double toBalanceAf;

	private Integer transSeq;
	private Character tallyInd;
	private Character status;

	private BillUI bill;

	private boolean adhoc;
	private boolean adjust;
	private boolean tallied;

	public TransactionUI() {
	}

	public TransactionUI(Transaction t) {
		city = new CityUI(t.getDataKey());
		id = t.getTransId();
		description = t.getDescription();
		amount = t.getAmount();
		category = new CategoryUI(t.getCategory());
		adhoc = t.getAdhocInd() == 'Y' ? true : false;
		adjust = t.getAdjustInd() == 'Y' ? true : false;
		entryDate = t.getEntryDate();
		transDate = t.getTransDate();
		fromAccount = new AccountUI(t.getFromAccount());
		fromBalanceBf = t.getFromBalanceBf();
		fromBalanceAf = t.getFromBalanceAf();
		toAccount = new AccountUI(t.getToAccount());
		toBalanceBf = t.getToBalanceBf();
		toBalanceAf = t.getToBalanceAf();
		status = t.getStatus();
		transSeq = t.getTransSeq();
		tallyInd = t.getTallyInd();
		tallyDate = t.getTallyDate();
		tallied = t.getTallyInd() == 'Y' ? true : false;

		if (t.getFromBill() != null) {
			bill = new BillUI();
			bill.setId(t.getFromBill().getBillId());
			bill.setBillDt(t.getFromBill().getBillDt());
			bill.buildName();
		}
	}

	public boolean isAdhoc() {
		return adhoc;
	}

	public void setAdhoc(boolean adhoc) {
		this.adhoc = adhoc;
	}

	public boolean isAdjust() {
		return adjust;
	}

	public void setAdjust(boolean adjust) {
		this.adjust = adjust;
	}

	public CityUI getCity() {
		return city;
	}

	public void setCity(CityUI city) {
		this.city = city;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public CategoryUI getCategory() {
		return category;
	}

	public void setCategory(CategoryUI category) {
		this.category = category;
	}

	public double getAmount() {
		return FU.toAmount(amount);
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public Date getEntryDate() {
		return entryDate;
	}

	public void setEntryDate(Date entryDate) {
		this.entryDate = entryDate;
	}

	public Date getTransDate() {
		return transDate;
	}

	// Input is string as comes in JSON.
	public void setTransDate(String transDate) {
		try {
			this.transDate = FU.df(FU.DATE.ddMMMyyyy).parse(transDate);
		} catch (ParseException e) {
		}
	}

	public AccountUI getFromAccount() {
		return fromAccount;
	}

	public void setFromAccount(AccountUI fromAccount) {
		this.fromAccount = fromAccount;
	}

	public AccountUI getToAccount() {
		return toAccount;
	}

	public void setToAccount(AccountUI toAccount) {
		this.toAccount = toAccount;
	}

	public String getDescription() {
		return WordUtils.capitalize(description);
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getFromBalanceAf() {
		return FU.toAmount(fromBalanceAf);
	}

	public void setFromBalanceAf(double fromBalanceAf) {
		this.fromBalanceAf = fromBalanceAf;
	}

	public double getToBalanceAf() {
		return FU.toAmount(toBalanceAf);
	}

	public void setToBalanceAf(double toBalanceAf) {
		this.toBalanceAf = toBalanceAf;
	}

	public double getFromBalanceBf() {
		return FU.toAmount(fromBalanceBf);
	}

	public void setFromBalanceBf(double fromBalanceBf) {
		this.fromBalanceBf = fromBalanceBf;
	}

	public double getToBalanceBf() {
		return FU.toAmount(toBalanceBf);
	}

	public void setToBalanceBf(double toBalanceBf) {
		this.toBalanceBf = toBalanceBf;
	}

	public Integer getTransSeq() {
		return transSeq;
	}

	public void setTransSeq(Integer transSeq) {
		this.transSeq = transSeq;
	}

	public Character getTallyInd() {
		return tallyInd;
	}

	public void setTallyInd(Character tallyInd) {
		this.tallyInd = tallyInd;
	}

	public Character getStatus() {
		return status;
	}

	public void setStatus(Character status) {
		this.status = status;
	}

	public Date getTallyDate() {
		return tallyDate;
	}

	public void setTallyDate(Date tallyDate) {
		this.tallyDate = tallyDate;
	}

	public boolean isTallied() {
		return tallied;
	}

	public void setTallied(boolean tallied) {
		this.tallied = tallied;
	}

	public BillUI getBill() {
		return bill;
	}

	public void setBill(BillUI bill) {
		this.bill = bill;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
