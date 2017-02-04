package com.expense.utils;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

import org.apache.commons.beanutils.BeanUtils;

public class FU {
	public static PropertyResourceBundle expense;

	static {
		FU.expense = (PropertyResourceBundle) ResourceBundle.getBundle("expense");
	}

	public enum DATE {
		yyyyMMdd("yyyy-MM-dd"), ddMMMyyyy("dd-MMM-yyyy"), yyyyMM("yyyyMM"), MMMyy("MMM-yy"), yyyy("yyyy");
		public String format;

		private DATE(String format) {
			this.format = format;
		}
	}

	public enum NUMBER {
		AMOUNT("#,##0.00"), NOCOMMA("###0.00");
		public String format;

		private NUMBER(String format) {
			this.format = format;
		}
	}

	public static DateFormat df(DATE d) {
		return new SimpleDateFormat(d.format);
	}

	public static DecimalFormat nf(NUMBER n) {
		return new DecimalFormat(n.format);
	}

	public static double toAmount(double d) {
		try {
			java.lang.Number number = nf(NUMBER.NOCOMMA).parse(nf(NUMBER.NOCOMMA).format(d));
			if (number instanceof Double) {
				return (double) number;
			} else if (number instanceof Long) {
				return (long) number;
			} else {
				// Default, return as is.
				return d;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

	public static void copyBean(Object dest, Object src) {
		try {
			BeanUtils.copyProperties(dest, src);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static Calendar getYearEnd(Date d) {
		Calendar c = Calendar.getInstance();
		c.setTime(d);
		c.set(Calendar.MONTH, Calendar.DECEMBER);
		c.set(Calendar.DAY_OF_MONTH, 31);
		return c;
	}

	public static Calendar getYearBegin(Date d) {
		Calendar c = Calendar.getInstance();
		c.setTime(d);
		c.set(Calendar.MONTH, Calendar.JANUARY);
		c.set(Calendar.DAY_OF_MONTH, 1);
		return c;
	}
}
