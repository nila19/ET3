package com.expense.mvc.model.ui;

import org.apache.commons.lang3.builder.ToStringBuilder;

import com.expense.mvc.model.entity.DataKey;
import com.expense.utils.Utils;

public class CityUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private int id;
	private String name = "";
	private String currency = "";
	private char status = 0;

	public CityUI() {
	}

	public CityUI(DataKey dk) {
		id = dk.getDataKey();
		name = dk.getDescription();
		currency = dk.getCurrency();
		status = dk.getStatus();
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

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public char getStatus() {
		return status;
	}

	public void setStatus(char status) {
		this.status = status;
	}

	// Custom methods.
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
