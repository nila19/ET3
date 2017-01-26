package com.expense.mvc.model.ui;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class TransMinUI implements java.io.Serializable {
	private static final long serialVersionUID = 654487747864639606L;
	private int id = 0;

	public TransMinUI() {
	}

	public TransMinUI(int id) {
		this.id = id;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
