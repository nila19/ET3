package com.expense.mvc.model.ui;

import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;

import com.expense.utils.FU;

public class MonthUI implements java.io.Serializable, Comparable<MonthUI> {
	private static final long serialVersionUID = 1L;

	private Date id;
	private String name;
	private boolean aggregate;
	private int seq;

	public MonthUI() {
	}

	public MonthUI(Date id) {
		this(id, false);
	}

	public MonthUI(Date id, boolean aggregate) {
		this.id = id;
		this.aggregate = aggregate;

		// If year, make the month 13, so it gets sorted ahead of all months in desc order.
		if (aggregate) {
			this.name = FU.df(FU.DATE.yyyy).format(id);
			this.seq = (Integer.valueOf(FU.df(FU.DATE.yyyy).format(id)) * 100) + 13;
		} else {
			this.name = FU.df(FU.DATE.MMMyy).format(id);
			this.seq = Integer.valueOf(FU.df(FU.DATE.yyyyMM).format(id));
		}
	}

	public Date getId() {
		return this.id;
	}

	public void setId(Date id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getSeq() {
		return this.seq;
	}

	public void setSeq(int seq) {
		this.seq = seq;
	}

	public boolean isAggregate() {
		return aggregate;
	}

	public void setAggregate(boolean aggregate) {
		this.aggregate = aggregate;
	}

	@Override
	public int compareTo(MonthUI o) {
		return new Integer(this.seq).compareTo(o.seq);
	}

	@Override
	public int hashCode() {
		return this.seq;
	}

	@Override
	public boolean equals(Object o) {
		if (o == null) {
			return false;
		}
		return this.seq == ((MonthUI) o).seq;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}