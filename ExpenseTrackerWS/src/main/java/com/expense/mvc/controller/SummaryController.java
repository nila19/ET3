package com.expense.mvc.controller;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expense.mvc.model.ui.ChartUI;
import com.expense.mvc.model.ui.MonthUI;
import com.expense.mvc.model.ui.SummaryUI;
import com.expense.mvc.service.StartupService;
import com.expense.mvc.service.SummaryService;

@RestController
@CrossOrigin(origins = "http://localhost:8020")
@RequestMapping("/summary")
public class SummaryController {

	@Autowired
	private SummaryService summaryService;

	@Autowired
	private StartupService ss;

	@RequestMapping(value = "/go", method = RequestMethod.GET)
	public List<SummaryUI> summary(@RequestParam int city, @RequestParam boolean regular, @RequestParam boolean adhoc,
			@RequestParam boolean forecast) throws ParseException {
		return summaryService.getSummary(city, regular, adhoc, forecast);
	}

	@RequestMapping(value = "/chart", method = RequestMethod.GET)
	public ChartUI chart(@RequestParam int city) throws ParseException {
		SummaryUI sui = summaryService.getSummary(city, true, true, false).get(0);
		List<MonthUI> months = ss.getAllTransMonths(city);
		ChartUI cui = new ChartUI();
		for (int i = 0; i < months.size(); i++) {
			MonthUI mui = months.get(i);
			if (!mui.isAggregate()) {
				cui.getLabels().add(mui.getName());
				cui.getValues().add(sui.amount[i]);
			}
		}
		return cui;
	}
}
