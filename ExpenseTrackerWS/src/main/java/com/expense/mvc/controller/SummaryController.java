package com.expense.mvc.controller;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expense.mvc.model.ui.SummaryUI;
import com.expense.mvc.service.SummaryService;

@RestController
@CrossOrigin(origins = "http://localhost:8020")
@RequestMapping("/summary")
public class SummaryController {

	@Autowired
	private SummaryService summaryService;

	@RequestMapping(value = "/go", method = RequestMethod.GET)
	public List<SummaryUI> summary(@RequestParam int city, @RequestParam boolean regular, @RequestParam boolean adhoc,
			@RequestParam boolean forecast) throws ParseException {
		return summaryService.getSummary(city, regular, adhoc, forecast);
	}
}
