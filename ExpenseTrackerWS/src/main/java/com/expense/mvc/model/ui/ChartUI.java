package com.expense.mvc.model.ui;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class ChartUI implements java.io.Serializable {
	private static final long serialVersionUID = 654487747864639606L;
	private List<String> labels = new ArrayList<String>();
	private List<Double> regulars = new ArrayList<Double>();
	private List<Double> adhocs = new ArrayList<Double>();
	private List<Double> totals = new ArrayList<Double>();

	public ChartUI() {
	}

	public List<String> getLabels() {
		return labels;
	}

	public void setLabels(List<String> labels) {
		this.labels = labels;
	}

	public List<Double> getRegulars() {
		return regulars;
	}

	public void setRegulars(List<Double> regulars) {
		this.regulars = regulars;
	}

	public List<Double> getAdhocs() {
		return adhocs;
	}

	public void setAdhocs(List<Double> adhocs) {
		this.adhocs = adhocs;
	}

	public List<Double> getTotals() {
		return totals;
	}

	public void setTotals(List<Double> totals) {
		this.totals = totals;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
