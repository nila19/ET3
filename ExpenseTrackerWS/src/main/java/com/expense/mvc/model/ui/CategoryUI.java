package com.expense.mvc.model.ui;

import org.apache.commons.lang3.builder.ToStringBuilder;

import com.expense.mvc.model.entity.Category;

public class CategoryUI implements java.io.Serializable, Comparable<CategoryUI> {
	private static final long serialVersionUID = 1L;

	private static final String SEP = " ~ ";

	private int id;
	private String name = "";
	private String mainCategory = new String("");
	private String subCategory = new String("");
	private char status;
	private Short displayOrder;

	public CategoryUI() {
	}

	public CategoryUI(Category cat) {
		id = cat.getCategoryId();
		name = cat.getMainCategory() + SEP + cat.getSubCategory();
		mainCategory = cat.getMainCategory();
		subCategory = cat.getSubCategory();
		status = cat.getStatus();
		displayOrder = cat.getDisplayOrder();
	}

	public CategoryUI(String category) {
		this.name = category;
		this.mainCategory = category.split(SEP)[0];
		this.subCategory = category.split(SEP)[1];
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getMainCategory() {
		return mainCategory;
	}

	public void setMainCategory(String mainCategory) {
		this.mainCategory = mainCategory;
	}

	public String getSubCategory() {
		return subCategory;
	}

	public void setSubCategory(String subCategory) {
		this.subCategory = subCategory;
	}

	public char getStatus() {
		return status;
	}

	public void setStatus(char status) {
		this.status = status;
	}

	public Short getDisplayOrder() {
		return displayOrder;
	}

	public void setDisplayOrder(Short displayOrder) {
		this.displayOrder = displayOrder;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

	@Override
	public int compareTo(CategoryUI o) {
		return this.displayOrder.compareTo(o.displayOrder);
	}

	@Override
	public int hashCode() {
		return id;
	}

	@Override
	public boolean equals(Object o) {
		if (o == null) {
			return false;
		}
		return id == ((CategoryUI) o).id;
	}
}
