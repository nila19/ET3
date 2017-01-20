package com.expense.mvc.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expense.mvc.model.ui.TransactionUI;
import com.expense.mvc.service.SearchService;

@RestController
@CrossOrigin(origins = "http://localhost:8020")
@RequestMapping("/search")
public class SearchController {

	@Autowired
	private SearchService ss;

	@RequestMapping(value = "/go", method = RequestMethod.GET)
	public List<TransactionUI> search(@RequestParam Map<String, String> input) {
		return ss.search(input);
	}
}
