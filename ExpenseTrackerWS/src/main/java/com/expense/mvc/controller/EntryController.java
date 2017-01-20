package com.expense.mvc.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expense.mvc.model.entity.DataKey;
import com.expense.mvc.model.ui.BillUI;
import com.expense.mvc.model.ui.CityUI;
import com.expense.mvc.model.ui.SwapUI;
import com.expense.mvc.model.ui.TransactionUI;
import com.expense.mvc.service.EntryService;
import com.expense.mvc.service.StartupService;
import com.expense.mvc.service.TallyService;

@RestController
@CrossOrigin(origins = "http://localhost:8020")
@RequestMapping("/entry")
public class EntryController {

	@Autowired
	private StartupService sus;

	@Autowired
	private EntryService es;

	@Autowired
	private TallyService ts;

	@SuppressWarnings("unused")
	private void checkDataKeyActive(int city) throws Exception {
		CityUI ui = sus.getDataKeyById(city);
		if (ui.getStatus() != DataKey.Status.ACTIVE.status) {
			throw new Exception("City inactive");
		}
	}

	@RequestMapping(value = "/transactions", method = RequestMethod.GET)
	public List<TransactionUI> getTransactions(@RequestParam int city, @RequestParam int account, @RequestParam int bill) {
		//Defaulting the 'pending' flag to FALSE. Future TODO.
		return ts.getTransactions(account, false, bill,city);
	}

	@RequestMapping(value = "/transaction/{transId}", method = RequestMethod.GET)
	public TransactionUI getTransaction(@PathVariable int transId) {
		return es.getTransaction(transId);
	}

	@RequestMapping(value = "/bills/{accountId}", method = RequestMethod.GET)
	public List<BillUI> getBillsforAccount(@PathVariable int accountId) {
		return es.getBillsforAccount(accountId);
	}

	@RequestMapping(value = "/bill/{billId}", method = RequestMethod.GET)
	public BillUI getBill(@PathVariable int billId) {
		return es.getBill(billId);
	}

	@RequestMapping(value = "/tally/{accountId}", method = RequestMethod.POST)
	public void tallyAccount(@PathVariable int accountId) {
		//TODO checkDataKeyActive(city);
		ts.tallyAccount(accountId);
	}

	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public void addExpense(@RequestBody TransactionUI tui) {
		//TODO checkDataKeyActive(cityId);
		es.addExpense(tui);
	}

	@RequestMapping(value = "/modify/{transId}", method = RequestMethod.POST)
	public void modifyExpense(@PathVariable int transId,@RequestBody TransactionUI tui) {
		//TODO checkDataKeyActive(cityId);
		es.modifyExpense(transId, tui);
	}

	@RequestMapping(value = "/delete/{transId}", method = RequestMethod.POST)
	public void deleteExpense(@PathVariable int transId) {
		//TODO checkDataKeyActive(cityId);
		es.deleteExpense(transId);
	}

	@RequestMapping(value = "/swap", method = RequestMethod.POST)
	public void swapSequence(@RequestBody SwapUI[] uis) {
		//TODO checkDataKeyActive(cityId);
		es.swapSequence(uis);
	}

	@RequestMapping(value = "/paybill/{billId}", method = RequestMethod.POST)
	public void payBill(@PathVariable int billId,@RequestBody TransactionUI tui) {
		//TODO checkDataKeyActive(cityId);
		es.payBill(tui);
	}
}