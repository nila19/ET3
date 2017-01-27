package com.expense.mvc.model.ui;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class SummaryUI implements java.io.Serializable, Comparable<SummaryUI> {
	private static final long serialVersionUID = 1L;

	private CategoryUI category;
	public double[] amount;
	public int[] count;

	public SummaryUI() {
	}

	public SummaryUI(CategoryUI category) {
		this.category = category;
	}

	public CategoryUI getCategory() {
		return this.category;
	}

	public void setCategory(CategoryUI category) {
		this.category = category;
	}

	public double[] getAmount() {
		return this.amount;
	}

	public void setAmount(double[] amount) {
		this.amount = amount;
	}

	public int[] getCount() {
		return this.count;
	}

	public void setCount(int[] count) {
		this.count = count;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

	@Override
	public int compareTo(SummaryUI o) {
		int i = this.category.getDisplayOrder().compareTo(o.category.getDisplayOrder());
		if (i != 0) {
			return i;
		}
		return 0;
	}
}
