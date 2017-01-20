package com.expense.mvc.model.ui;

import java.text.ParseException;
import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.text.WordUtils;

import com.expense.mvc.model.entity.Transaction;
import com.expense.utils.FU;

public class TransactionUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private int transId = 0;
	private int categoryId;
	private String mainCategory = "";
	private String subCategory = "";
	private String category = "";
	private String description = "";
	private double amount;
	private Date entryDate;
	private Date entryMonth;
	private Date transDate;
	private Date transMonth;
	private char adhocInd;
	private char adjustInd;
	
	private int fromAccountId;
	private String fromAccountDesc = "";
	private int toAccountId;
	private String toAccountDesc = "";
	private double fromBalanceAf;
	private double toBalanceAf;
	private double fromBalanceBf;
	private double toBalanceBf;

	private Integer transSeq;
	private Character tallyInd;
	private Date tallyDate;
	private Character status;

	private int fromBillId;
	private Date fromBillDt;
	private int toBillId;
	private Date toBillDt;

	private char flag;
	public enum FLAG {
		ADHOC('H'), ADJUST('J');
		public char ind;
		private FLAG(char ind) {
			this.ind = ind;
		}
	}

	public TransactionUI() {
	}

	public TransactionUI(Transaction t) {
		transId = t.getTransId();
		description = t.getDescription();
		amount = t.getAmount();
		if (t.getCategory() != null) {
			categoryId = t.getCategory().getCategoryId();
			mainCategory = t.getCategory().getMainCategory();
			subCategory = t.getCategory().getSubCategory();
			category = mainCategory + " ~ " + subCategory;
		}
		adhocInd = t.getAdhocInd();
		adjustInd = t.getAdjustInd();
		calculateFlag();
		setEntryDate(t.getEntryDate());
		setEntryMonth(t.getEntryMonth());
		setTransDate(t.getTransDate());
		setTransMonth(t.getTransMonth());
		fromAccountId = t.getFromAccount().getAccountId();
		fromAccountDesc = t.getFromAccount().getDescription();
		toAccountId = t.getToAccount().getAccountId();
		toAccountDesc = t.getToAccount().getDescription();
		fromBalanceAf = t.getFromBalanceAf();
		toBalanceAf = t.getToBalanceAf();
		fromBalanceBf = t.getFromBalanceBf();
		toBalanceBf = t.getToBalanceBf();
		status = t.getStatus();
		transSeq = t.getTransSeq();
		tallyInd = t.getTallyInd();
		setTallyDate(t.getTallyDate());
		if (t.getFromBill() != null) {
			fromBillId = t.getFromBill().getBillId();
			fromBillDt = t.getFromBill().getBillDt();
		}
		if (t.getToBill() != null) {
			toBillId = t.getToBill().getBillId();
			toBillDt = t.getToBill().getBillDt();
		}
	}

	public void calculateFlag() {
		if (adhocInd == 'Y') {
			flag = FLAG.ADHOC.ind;
		} else if (adjustInd == 'Y') {
			flag = FLAG.ADJUST.ind;
		}
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
	
	public int getTransId() {
		return transId;
	}

	public void setTransId(int transId) {
		this.transId = transId;
	}

	public int getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}

	public String getMainCategory() {
		return mainCategory;
	}

	public void setMainCategory(String mainCategory) {
		this.mainCategory = mainCategory;
	}

	public String getSubCategory() {
		return subCategory;
	}

	public void setSubCategory(String subCategory) {
		this.subCategory = subCategory;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public Date getEntryDate() {
		return entryDate;
	}

	public void setEntryDate(Date entryDate) {
		try {
			this.entryDate = FU.date(FU.Date.yyyyMMddHHmmss).parse(FU.date(FU.Date.yyyyMMddHHmmss).format(entryDate));
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}

	public Date getEntryMonth() {
		return entryMonth;
	}

	public void setEntryMonth(Date entryMonth) {
		try {
			this.entryMonth = FU.date(FU.Date.yyyyMMdd).parse(FU.date(FU.Date.yyyyMMdd).format(entryMonth));
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}

	public Date getTransDate() {
		return transDate;
	}

	public void setTransDate(Date transDate) {
		this.transDate = transDate;
	}

	public Date getTransMonth() {
		return transMonth;
	}

	public void setTransMonth(Date transMonth) {
		this.transMonth = transMonth;
	}

	public int getFromAccountId() {
		return fromAccountId;
	}

	public void setFromAccountId(int fromAccountId) {
		this.fromAccountId = fromAccountId;
	}

	public String getFromAccountDesc() {
		return fromAccountDesc;
	}

	public void setFromAccountDesc(String fromAccountDesc) {
		this.fromAccountDesc = fromAccountDesc;
	}

	public int getToAccountId() {
		return toAccountId;
	}

	public void setToAccountId(int toAccountId) {
		this.toAccountId = toAccountId;
	}

	public String getToAccountDesc() {
		return toAccountDesc;
	}

	public void setToAccountDesc(String toAccountDesc) {
		this.toAccountDesc = toAccountDesc;
	}

	public char getAdhocInd() {
		return adhocInd;
	}

	public void setAdhocInd(char adhocInd) {
		this.adhocInd = adhocInd;
	}

	public char getAdjustInd() {
		return adjustInd;
	}

	public void setAdjustInd(char adjustInd) {
		this.adjustInd = adjustInd;
	}

	public String getDescription() {
		return WordUtils.capitalize(description);
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getFromBalanceAf() {
		return fromBalanceAf;
	}

	public void setFromBalanceAf(double fromBalanceAf) {
		this.fromBalanceAf = fromBalanceAf;
	}

	public double getToBalanceAf() {
		return toBalanceAf;
	}

	public void setToBalanceAf(double toBalanceAf) {
		this.toBalanceAf = toBalanceAf;
	}

	public double getFromBalanceBf() {
		return fromBalanceBf;
	}

	public void setFromBalanceBf(double fromBalanceBf) {
		this.fromBalanceBf = fromBalanceBf;
	}

	public double getToBalanceBf() {
		return toBalanceBf;
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
		try {
			this.tallyDate = FU.date(FU.Date.yyyyMMddHHmmss).parse(FU.date(FU.Date.yyyyMMddHHmmss).format(tallyDate));
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}

	public char getFlag() {
		return flag;
	}

	public void setFlag(char flag) {
		this.flag = flag;
	}

	public int getFromBillId() {
		return fromBillId;
	}

	public void setFromBillId(int fromBillId) {
		this.fromBillId = fromBillId;
	}

	public Date getFromBillDt() {
		return fromBillDt;
	}

	public void setFromBillDt(Date fromBillDt) {
		this.fromBillDt = fromBillDt;
	}

	public int getToBillId() {
		return toBillId;
	}

	public void setToBillId(int toBillId) {
		this.toBillId = toBillId;
	}

	public Date getToBillDt() {
		return toBillDt;
	}

	public void setToBillDt(Date toBillDt) {
		this.toBillDt = toBillDt;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
