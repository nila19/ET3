package com.expense.mvc.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expense.mvc.model.ui.AccountUI;
import com.expense.mvc.model.ui.BillUI;
import com.expense.mvc.model.ui.CategoryUI;
import com.expense.mvc.model.ui.CityUI;
import com.expense.mvc.model.ui.MonthUI;
import com.expense.mvc.service.StartupService;

@RestController
@CrossOrigin(origins = "http://localhost:8020")
@RequestMapping("/startup")
public class StartupController {

	@Autowired
	private StartupService ss;

	@RequestMapping(value = "/cities", method = RequestMethod.GET)
	public List<CityUI> getCities() {
		return ss.getAllDataKeys();
	}

	@RequestMapping(value = "/city/default", method = RequestMethod.GET)
	public CityUI getDefaultCity() {
		return ss.getDefaultDataKey();
	}

	@RequestMapping(value = "/city/{city}", method = RequestMethod.GET)
	public CityUI getCity(@PathVariable int city) {
		return ss.getDataKeyById(city);
	}

	@RequestMapping(value = "/categories", method = RequestMethod.GET)
	public List<CategoryUI> getCategories(@RequestParam int city) {
		return ss.getAllCategories(city);
	}

	@RequestMapping(value = "/descriptions", method = RequestMethod.GET)
	public List<String> getDescriptions(@RequestParam int city) {
		return ss.getAllDescription(Integer.valueOf(city));
	}

	@RequestMapping(value = "/accounts", method = RequestMethod.GET)
	public List<AccountUI> getActiveAccounts(@RequestParam int city) {
		return ss.getAllActiveAccounts(city);
	}

	@RequestMapping(value = "/accounts/all", method = RequestMethod.GET)
	public List<AccountUI> getAllAccounts(@RequestParam int city) {
		return ss.getAllAccounts(city);
	}

	@RequestMapping(value = "/account/{account}", method = RequestMethod.GET)
	public AccountUI getAccount(@PathVariable int account) {
		return ss.getAccountUI(account);
	}

	@RequestMapping(value = "/bills", method = RequestMethod.GET)
	public List<BillUI> getBills(@RequestParam int city) {
		return ss.getAllBills(city);
	}

	@RequestMapping(value = "/months/entry", method = RequestMethod.GET)
	public List<MonthUI> getEntryMonths(@RequestParam int city) {
		return ss.getAllEntryMonths(city);
	}

	@RequestMapping(value = "/months/trans", method = RequestMethod.GET)
	public List<MonthUI> getTransMonths(@RequestParam int city) {
		return ss.getAllTransMonths(city);
	}
}