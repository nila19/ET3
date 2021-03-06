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
	private String imageCode;
	private char status;
	private Short displayOrder;

	public CategoryUI() {
	}

	public CategoryUI(int id) {
		this.id = id;
	}

	public CategoryUI(Category cat) {
		id = cat.getCategoryId();
		name = cat.getMainCategory() + SEP + cat.getSubCategory();
		mainCategory = cat.getMainCategory();
		subCategory = cat.getSubCategory();
		imageCode = cat.getImageCode();
		status = cat.getStatus();
		displayOrder = cat.getDisplayOrder();
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

	public String getImageCode() {
		return imageCode;
	}

	public void setImageCode(String imageCode) {
		this.imageCode = imageCode;
	}

	public char getStatus() {
		return status;
	}

	public void setStatus(char status) {
		this.status = status;
	}

	public boolean isActive() {
		return (this.status == Category.Status.ACTIVE.status);
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
