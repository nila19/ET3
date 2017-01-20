package com.expense.utils;

import org.apache.commons.beanutils.BeanUtils;

public final class Utils {

	public static void copyBean(Object dest, Object src) {
		try {
			BeanUtils.copyProperties(dest, src);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
