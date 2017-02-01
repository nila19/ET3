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
import com.expense.mvc.model.ui.BillPayUI;
import com.expense.mvc.model.ui.BillUI;
import com.expense.mvc.model.ui.CityUI;
import com.expense.mvc.model.ui.SwapUI;
import com.expense.mvc.model.ui.TransMinUI;
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

	private void checkDataKeyActive(int city) throws Exception {
		CityUI ui = sus.getDataKeyById(city);
		if (ui.getStatus() != DataKey.Status.ACTIVE.status) {
			throw new Exception("City is inactive. Cannot modify data.");
		}
	}

	@RequestMapping(value = "/transactions", method = RequestMethod.GET)
	public List<TransactionUI> getTransactions(@RequestParam int city, @RequestParam int account,
			@RequestParam int bill) {
		// TODO Defaulting the 'pending' flag to FALSE. Future enhancement to fetch Tally expense list.
		return ts.getTransactions(account, false, bill, city);
	}

	@RequestMapping(value = "/transaction/{transId}", method = RequestMethod.GET)
	public TransactionUI getTransaction(@PathVariable int transId) {
		return es.getTransaction(transId);
	}

	@RequestMapping(value = "/bills", method = RequestMethod.GET)
	public List<BillUI> getBillsforAccount(@RequestParam int acctId, @RequestParam boolean open) {
		return es.getBillsforAccount(acctId, open);
	}

	@RequestMapping(value = "/bills/all", method = RequestMethod.GET)
	public List<BillUI> getAllBillsforAccount(@RequestParam int acctId) {
		return es.getAllBillsforAccount(acctId);
	}

	@RequestMapping(value = "/bill/{billId}", method = RequestMethod.GET)
	public BillUI getBill(@PathVariable int billId) {
		return es.getBill(billId);
	}

	@RequestMapping(value = "/tally/{cityId}/{accountId}", method = RequestMethod.POST)
	public void tallyAccount(@PathVariable int cityId, @PathVariable int accountId) throws Exception {
		checkDataKeyActive(cityId);
		ts.tallyAccount(accountId);
	}

	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public TransMinUI addExpense(@RequestBody TransactionUI tui) throws Exception {
		checkDataKeyActive(tui.getCity().getId());
		return es.addExpense(tui);
	}

	@RequestMapping(value = "/modify", method = RequestMethod.POST)
	public void modifyExpense(@RequestBody TransactionUI tui) throws Exception {
		checkDataKeyActive(tui.getCity().getId());
		es.modifyExpense(tui);
	}

	@RequestMapping(value = "/delete/{cityId}/{transId}", method = RequestMethod.POST)
	public void deleteExpense(@PathVariable int cityId, @PathVariable int transId) throws Exception {
		checkDataKeyActive(cityId);
		es.deleteExpense(transId);
	}

	@RequestMapping(value = "/swap/{cityId}", method = RequestMethod.POST)
	public void swapSequence(@PathVariable int cityId, @RequestBody SwapUI[] uis) throws Exception {
		checkDataKeyActive(cityId);
		es.swapSequence(uis);
	}

	@RequestMapping(value = "/paybill", method = RequestMethod.POST)
	public TransMinUI payBill(@RequestBody BillPayUI bpui) throws Exception {
		checkDataKeyActive(bpui.getCity().getId());
		return es.payBill(bpui);
	}
}