package com.expense.mvc.model.entity;

// Generated Jul 12, 2012 1:19:22 PM by Hibernate Tools 3.4.0.CR1. Customized by Bala.
//Customization - 1. Field level Annotations
//				- 2. Extends Entity for ToString Implementation.

import static javax.persistence.GenerationType.IDENTITY;

import java.text.ParseException;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import com.expense.utils.FU;

/**
 * Transaction generated by hbm2java
 */
@Entity
@Table(name = "TRANSACTIONS")
public class Transaction extends com.expense.mvc.model.BaseEntity
		implements java.io.Serializable, Comparable<Transaction> {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "TRANS_ID", unique = true, nullable = false)
	private Integer transId;

	@Column(name = "DATA_KEY", nullable = false)
	private int dataKey;

	@Column(name = "ENTRY_DATE", length = 0)
	private String strEntryDate;

	@Column(name = "ENTRY_MONTH", nullable = false)
	private String strEntryMonth;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CATEGORY_ID")
	private Category category;

	@Column(name = "DESCRIPTION", nullable = false, length = 50)
	private String description;

	@Column(name = "AMOUNT", nullable = false, precision = 11)
	private double amount;

	@Column(name = "TRANS_DATE", nullable = false)
	private String strTransDate;

	@Column(name = "TRANS_MONTH", nullable = false)
	private String strTransMonth;

	@Column(name = "TRANS_SEQ")
	private Integer transSeq;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "FROM_ACCOUNT_ID", nullable = false)
	private Account fromAccount;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "FROM_BILL_ID")
	private Bill fromBill;

	@Column(name = "FROM_BALANCE_BF", precision = 11)
	private double fromBalanceBf;

	@Column(name = "FROM_BALANCE_AF", precision = 11)
	private double fromBalanceAf;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "TO_ACCOUNT_ID")
	private Account toAccount;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "TO_BILL_ID")
	private Bill toBill;

	@Column(name = "TO_BALANCE_BF", precision = 11)
	private double toBalanceBf;

	@Column(name = "TO_BALANCE_AF", precision = 11)
	private double toBalanceAf;

	@Column(name = "ADHOC_IND", length = 1)
	private Character adhocInd;

	public enum Adhoc {
		YES('Y'), NO('N');

		public char type;

		private Adhoc(char type) {
			this.type = type;
		}
	}

	@Column(name = "ADJUST_IND", length = 1)
	private Character adjustInd;

	public enum Adjust {
		YES('Y'), NO('N');

		public char type;

		private Adjust(char type) {
			this.type = type;
		}
	}

	@Column(name = "TALLY_IND", length = 1)
	private Character tallyInd;

	public enum Tally {
		YES('Y'), NO('N');

		public char status;

		private Tally(char status) {
			this.status = status;
		}
	}

	@Column(name = "TALLY_DATE", length = 0)
	private String strTallyDate;

	@Column(name = "STATUS", length = 1)
	private Character status;

	public enum Status {
		POSTED('P'), DRAFT('D');

		public char status;

		private Status(char status) {
			this.status = status;
		}
	}

	@SuppressWarnings("deprecation")
	@OneToOne(fetch = FetchType.LAZY, mappedBy = "payTran")
	@Cascade({ CascadeType.DELETE_ORPHAN, CascadeType.ALL })
	private Bill billPaid;

	public Transaction() {
	}

	public Integer getTransId() {
		return transId;
	}

	public void setTransId(Integer transId) {
		this.transId = transId;
	}

	public Account getFromAccount() {
		return fromAccount;
	}

	public void setFromAccount(Account fromAccount) {
		this.fromAccount = fromAccount;
	}

	public Account getToAccount() {
		return toAccount;
	}

	public void setToAccount(Account toAccount) {
		this.toAccount = toAccount;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public int getDataKey() {
		return dataKey;
	}

	public void setDataKey(int dataKey) {
		this.dataKey = dataKey;
	}

	public String getStrEntryDate() {
		return strEntryDate;
	}

	public void setStrEntryDate(String strEntryDate) {
		this.strEntryDate = strEntryDate;
	}

	public String getStrEntryMonth() {
		return strEntryMonth;
	}

	public void setStrEntryMonth(String strEntryMonth) {
		this.strEntryMonth = strEntryMonth;
	}

	public Date getEntryDate() {
		try {
			return FU.date(FU.Date.yyyyMMddHHmmss).parse(strEntryDate);
		} catch (ParseException e) {
			return new Date(0);
		}
	}

	public void setEntryDate(Date entryDate) {
		strEntryDate = FU.date(FU.Date.yyyyMMddHHmmss).format(entryDate);
	}

	public Date getEntryMonth() {
		try {
			return FU.date(FU.Date.yyyyMMdd).parse(strEntryMonth);
		} catch (ParseException e) {
			return new Date(0);
		}
	}

	public void setEntryMonth(Date entryMonth) {
		strEntryMonth = FU.date(FU.Date.yyyyMMdd).format(entryMonth);
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

	public String getStrTransDate() {
		return strTransDate;
	}

	public void setStrTransDate(String strTransDate) {
		this.strTransDate = strTransDate;
	}

	public String getStrTransMonth() {
		return strTransMonth;
	}

	public void setStrTransMonth(String strTransMonth) {
		this.strTransMonth = strTransMonth;
	}

	public Date getTransDate() {
		try {
			return FU.date(FU.Date.yyyyMMdd).parse(strTransDate);
		} catch (ParseException e) {
			return new Date(0);
		}
	}

	public void setTransDate(Date transDate) {
		strTransDate = FU.date(FU.Date.yyyyMMdd).format(transDate);
	}

	public Date getTransMonth() {
		try {
			return FU.date(FU.Date.yyyyMMdd).parse(strTransMonth);
		} catch (ParseException e) {
			return new Date(0);
		}
	}

	public void setTransMonth(Date transMonth) {
		strTransMonth = FU.date(FU.Date.yyyyMMdd).format(transMonth);
	}

	public Character getAdhocInd() {
		return adhocInd;
	}

	public void setAdhocInd(Character adhocInd) {
		this.adhocInd = adhocInd;
	}

	public Character getAdjustInd() {
		return adjustInd;
	}

	public void setAdjustInd(Character adjustInd) {
		this.adjustInd = adjustInd;
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

	public String getStrTallyDate() {
		return strTallyDate;
	}

	public void setStrTallyDate(String strTallyDate) {
		this.strTallyDate = strTallyDate;
	}

	public Date getTallyDate() {
		try {
			return FU.date(FU.Date.yyyyMMddHHmmss).parse(strTallyDate);
		} catch (Exception e) {
			return new Date(0);
		}
	}

	public void setTallyDate(Date tallyDate) {
		strTallyDate = FU.date(FU.Date.yyyyMMddHHmmss).format(tallyDate);
	}

	public boolean isAdjust() {
		return adjustInd == Adjust.YES.type;
	}

	public boolean isAdhoc() {
		return adhocInd == Adhoc.YES.type;
	}

	public boolean isTallied() {
		return tallyInd == Tally.YES.status;
	}

	@Override
	public int compareTo(Transaction o) {
		if (o.getEntryDate() == null) {
			return -1;
		} else if (this.getEntryDate() == null) {
			return 1;
		} else {
			return this.getEntryDate().compareTo(o.getEntryDate());
		}
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

	public Character getStatus() {
		return status;
	}

	public void setStatus(Character status) {
		this.status = status;
	}

	public Bill getFromBill() {
		return fromBill;
	}

	public void setFromBill(Bill fromBill) {
		this.fromBill = fromBill;
	}

	public Bill getToBill() {
		return toBill;
	}

	public void setToBill(Bill toBill) {
		this.toBill = toBill;
	}

	public Bill getBillPaid() {
		return billPaid;
	}

	public void setBillPaid(Bill billPaid) {
		this.billPaid = billPaid;
	}
}
