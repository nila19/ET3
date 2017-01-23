package com.expense.mvc.controller;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expense.mvc.service.SummaryService;

@RestController
@CrossOrigin(origins = "http://localhost:8020")
@RequestMapping("/summary")
public class SummaryController {

	@Autowired
	private SummaryService summaryService;

	@RequestMapping(value = "/go", method = RequestMethod.GET)
	public String summary(@RequestParam int city, @RequestParam String forecast, @RequestParam char adhoc) {
		boolean fc = BooleanUtils.toBoolean(forecast);

		// FIXME fix this.
		summaryService.getSummary(adhoc, fc, city);

		return "All OK";
	}
}
