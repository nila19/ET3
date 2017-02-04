package com.expense.mvc.controller;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expense.mvc.model.ui.AccountMinUI;
import com.expense.mvc.model.ui.CategoryUI;
import com.expense.mvc.model.ui.CityUI;
import com.expense.mvc.model.ui.FlagMinUI;
import com.expense.mvc.model.ui.MonthUI;
import com.expense.mvc.service.StartupService;

@RestController
@CrossOrigin(origins = "http://localhost:8020")
@RequestMapping("/startup")
public class StartupController {

	@Autowired
	private StartupService ss;

	@RequestMapping(value = "/connect", method = RequestMethod.GET)
	public FlagMinUI connect() {
		return ss.connect();
	}

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
		return ss.getCategories(city);
	}

	@RequestMapping(value = "/categories/all", method = RequestMethod.GET)
	public List<CategoryUI> getAllCategories(@RequestParam int city) {
		return ss.getAllCategories(city);
	}

	@RequestMapping(value = "/descriptions", method = RequestMethod.GET)
	public List<String> getDescriptions(@RequestParam int city) {
		return ss.getAllDescription(Integer.valueOf(city));
	}

	@RequestMapping(value = "/accounts", method = RequestMethod.GET)
	public List<AccountMinUI> getActiveAccounts(@RequestParam int city) {
		return ss.getAllActiveAccountsThin(city);
	}

	@RequestMapping(value = "/accounts/inactive", method = RequestMethod.GET)
	public List<AccountMinUI> getInactiveAccounts(@RequestParam int city) {
		return ss.getAllInactiveAccountsThin(city);
	}

	@RequestMapping(value = "/months/entry", method = RequestMethod.GET)
	public List<MonthUI> getEntryMonths(@RequestParam int city) throws ParseException {
		return ss.getAllEntryMonths(city);
	}

	@RequestMapping(value = "/months/trans", method = RequestMethod.GET)
	public List<MonthUI> getTransMonths(@RequestParam int city) throws ParseException {
		return ss.getAllTransMonths(city);
	}
}