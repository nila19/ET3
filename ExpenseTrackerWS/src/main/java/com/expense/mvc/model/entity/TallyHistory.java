package com.expense.mvc.model.entity;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "TALLY_HISTORY")
public class TallyHistory extends com.expense.mvc.model.BaseEntity
		implements java.io.Serializable, Comparable<TallyHistory> {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "TALLY_SEQ", unique = true, nullable = false)
	private Integer tallySeq;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ACCOUNT_ID", nullable = false)
	private Account account;

	@Column(name = "DATA_KEY", nullable = false)
	private int dataKey;

	@Column(name = "TALLY_BALANCE", precision = 11)
	private Double tallyBalance;

	@Column(name = "TALLY_DATE")
	private Timestamp tallyDate;

	public TallyHistory() {
	}

	public Integer getTallySeq() {
		return tallySeq;
	}

	public void setTallySeq(Integer tallySeq) {
		this.tallySeq = tallySeq;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public int getDataKey() {
		return dataKey;
	}

	public void setDataKey(int dataKey) {
		this.dataKey = dataKey;
	}

	public Double getTallyBalance() {
		return tallyBalance;
	}

	public void setTallyBalance(Double tallyBalance) {
		this.tallyBalance = tallyBalance;
	}

	public Timestamp getTallyDate() {
		return tallyDate;
	}

	public void setTallyDate(Timestamp tallyDate) {
		this.tallyDate = tallyDate;
	}

	@Override
	public int compareTo(TallyHistory o) {
		if (o.getTallySeq() == null) {
			return -1;
		} else if (getTallySeq() == null) {
			return 1;
		} else {
			return getTallySeq().compareTo(o.getTallySeq());
		}
	}
}
