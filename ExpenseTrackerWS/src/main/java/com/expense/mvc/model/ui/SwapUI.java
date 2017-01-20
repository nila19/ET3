package com.expense.mvc.model.ui;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class SwapUI implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private int code;
	private int fromTrans;
	private int toTrans;

	public SwapUI() {
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public int getFromTrans() {
		return fromTrans;
	}

	public void setFromTrans(int fromTrans) {
		this.fromTrans = fromTrans;
	}

	public int getToTrans() {
		return toTrans;
	}

	public void setToTrans(int toTrans) {
		this.toTrans = toTrans;
	}

	// Custom methods.
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
