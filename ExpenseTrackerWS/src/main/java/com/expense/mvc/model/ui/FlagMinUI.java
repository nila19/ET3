package com.expense.mvc.model.ui;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class FlagMinUI implements java.io.Serializable {
	private static final long serialVersionUID = 6681603218167323992L;
	private boolean flag = false;

	public FlagMinUI() {
	}

	public FlagMinUI(boolean flag) {
		this.setFlag(flag);
	}

	public boolean isFlag() {
		return flag;
	}

	public void setFlag(boolean flag) {
		this.flag = flag;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
