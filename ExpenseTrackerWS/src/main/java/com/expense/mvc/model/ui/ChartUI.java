package com.expense.mvc.model.ui;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class ChartUI implements java.io.Serializable {
	private static final long serialVersionUID = 654487747864639606L;
	private List<String> labels = new ArrayList<String>();
	private List<Double> values = new ArrayList<Double>();

	public ChartUI() {
	}

	public ChartUI(List<String> labels, List<Double> values) {
		this.labels = labels;
		this.values = values;
	}

	public List<String> getLabels() {
		return labels;
	}

	public void setLabels(List<String> labels) {
		this.labels = labels;
	}

	public List<Double> getValues() {
		return values;
	}

	public void setValues(List<Double> values) {
		this.values = values;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
