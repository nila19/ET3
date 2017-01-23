package com.expense.utils;

import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

public class Props {
	public static PropertyResourceBundle expense;

	static {
		Props.expense = (PropertyResourceBundle) ResourceBundle.getBundle("expense");
	}
}
