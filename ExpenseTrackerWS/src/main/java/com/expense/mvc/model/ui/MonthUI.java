package com.expense.mvc.model.ui;

import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;

import com.expense.utils.FU;

public class MonthUI implements java.io.Serializable, Comparable<MonthUI> {
	private static final long serialVersionUID = 1L;

	private Date id;
	private String name;
	private boolean aggregate;
	private Integer seq;

	public MonthUI() {
	}

	public MonthUI(Date transMonth) {
		this(transMonth, false);
	}

	public MonthUI(Date id, boolean aggregate) {
		this.id = id;
		this.setAggregate(aggregate);
		this.name = FU.date(FU.Date.MMMyy).format(id);

		// If year, transMonth will have 01 as month. Make it 13, so it gets sorted ahead of all
		// months in desc order.
		if (this.isAggregate()) {
			this.seq = (Integer.valueOf(FU.date(FU.Date.yyyy).format(id)) * 100) + 13;
		} else {
			this.seq = Integer.valueOf(FU.date(FU.Date.yyyyMM).format(id));
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
		return this.seq.compareTo(o.seq);
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