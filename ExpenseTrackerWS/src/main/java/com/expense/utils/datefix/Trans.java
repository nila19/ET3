package com.expense.utils.datefix;

import java.sql.Date;
import java.sql.Timestamp;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class Trans {
	private int id = 0;
	private Timestamp entryDate;
	private Date entryMonth;
	private Date transDate;
	private Date transMonth;
	private Timestamp tallyDate;

	private String entryDateOld;
	private String entryMonthOld;
	private String transDateOld;
	private String transMonthOld;
	private String tallyDateOld;

	private String entryDateNew;
	private String entryMonthNew;
	private String transDateNew;
	private String transMonthNew;
	private String tallyDateNew;

	private boolean match;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Timestamp getEntryDate() {
		return entryDate;
	}

	public void setEntryDate(Timestamp entryDate) {
		this.entryDate = entryDate;
	}

	public Date getEntryMonth() {
		return entryMonth;
	}

	public void setEntryMonth(Date entryMonth) {
		this.entryMonth = entryMonth;
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

	public Timestamp getTallyDate() {
		return tallyDate;
	}

	public void setTallyDate(Timestamp tallyDate) {
		this.tallyDate = tallyDate;
	}

	public String getEntryDateOld() {
		return entryDateOld;
	}

	public void setEntryDateOld(String entryDateOld) {
		this.entryDateOld = entryDateOld;
	}

	public String getEntryMonthOld() {
		return entryMonthOld;
	}

	public void setEntryMonthOld(String entryMonthOld) {
		this.entryMonthOld = entryMonthOld;
	}

	public String getTransDateOld() {
		return transDateOld;
	}

	public void setTransDateOld(String transDateOld) {
		this.transDateOld = transDateOld;
	}

	public String getTransMonthOld() {
		return transMonthOld;
	}

	public void setTransMonthOld(String transMonthOld) {
		this.transMonthOld = transMonthOld;
	}

	public String getTallyDateOld() {
		return tallyDateOld;
	}

	public void setTallyDateOld(String tallyDateOld) {
		this.tallyDateOld = tallyDateOld;
	}

	public String getEntryDateNew() {
		return entryDateNew;
	}

	public void setEntryDateNew(String entryDateNew) {
		this.entryDateNew = entryDateNew;
	}

	public String getEntryMonthNew() {
		return entryMonthNew;
	}

	public void setEntryMonthNew(String entryMonthNew) {
		this.entryMonthNew = entryMonthNew;
	}

	public String getTransDateNew() {
		return transDateNew;
	}

	public void setTransDateNew(String transDateNew) {
		this.transDateNew = transDateNew;
	}

	public String getTransMonthNew() {
		return transMonthNew;
	}

	public void setTransMonthNew(String transMonthNew) {
		this.transMonthNew = transMonthNew;
	}

	public String getTallyDateNew() {
		return tallyDateNew;
	}

	public void setTallyDateNew(String tallyDateNew) {
		this.tallyDateNew = tallyDateNew;
	}

	public boolean isMatch() {
		match = StringUtils.equalsIgnoreCase(entryDateOld, entryDateNew)
				&& StringUtils.equalsIgnoreCase(entryMonthOld, entryMonthNew)
				&& StringUtils.equalsIgnoreCase(transDateOld, transDateNew)
				&& StringUtils.equalsIgnoreCase(transMonthOld, transMonthNew)
				&& StringUtils.equalsIgnoreCase(tallyDateOld, tallyDateNew);
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
