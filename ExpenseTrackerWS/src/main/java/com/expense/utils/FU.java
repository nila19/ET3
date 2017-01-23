package com.expense.utils;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class FU {
	public enum Date {
		ddMMMyyyyhhmmssa("dd-MMM-yyyy hh:mm:ss a"), ddMMMyyhhmma("dd-MMM-yy hh:mm a"), ddMMM("dd-MMM"), yyyyMMdd("yyyy-MM-dd"), 
			yyyyMM("yyyyMM"), yyyy("yyyy"), ddMMMyy("dd-MMM-yy"), MMMyy("MMM-yy"), MMMyyyy("MMM-yyyy"), yyyyMMddHHmmss("yyyy-MM-dd HH:mm:ss"), yyyyMMMdd("yyyy-MMM-dd");
		public String format;
		private Date(String format) {
			this.format = format;
		}
	}

	public enum Number {
		AMOUNT("#,##0.00"), NOCOMMA("###0.00"), N0000("0000");
		public String format;
		private Number(String format) {
			this.format = format;
		}
	}

	public static DateFormat date(Date d) {
		return new SimpleDateFormat(d.format);
	}
	public static DecimalFormat number(Number n) {
		return new DecimalFormat(n.format);
	}
	
	public static double amt(double d) {
		try {
			java.lang.Number number = number(Number.NOCOMMA).parse(number(Number.NOCOMMA).format(d));
			if (number instanceof Double) {
				return (double) number;
			} else if (number instanceof Long) {
				return (long)number;
			} else {
				//Default, return as is.
				return d;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}
}
