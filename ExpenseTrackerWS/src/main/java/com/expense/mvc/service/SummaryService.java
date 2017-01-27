package com.expense.mvc.service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.expense.mvc.model.dao.TransactionDAO;
import com.expense.mvc.model.entity.Transaction;
import com.expense.mvc.model.ui.CategoryUI;
import com.expense.mvc.model.ui.MonthUI;
import com.expense.mvc.model.ui.SummaryUI;

@Service
public class SummaryService {

	@Autowired
	private StartupService ss;

	@Autowired
	private TransactionDAO transactionDAO;

	@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
	public List<SummaryUI> getSummary(int dataKey, boolean regular, boolean adhoc, boolean forecast)
			throws ParseException {
		List<CategoryUI> categories = ss.getAllCategories(dataKey);
		List<MonthUI> list = ss.getAllTransMonths(dataKey);
		List<Transaction> trans = transactionDAO.findForMonthlySummary(dataKey, regular, adhoc);

		// Step 0 : Add current month to the list, if not already present.
		MonthUI[] months = addCurrentMonth(list);

		// Step 1 : Build empty grid.
		Map<Integer, SummaryUI> grid = buildEmptyGrid(categories, months);

		// Step 2 : Populate the grid with trans data.
		populateGrid(grid, months, trans);

		// Step 4 : Populate the yearly summary columns with totals from the months of the year.
		calcYearlySummary(grid, months);

		if (forecast) {
			// Step 5 : Build forecast grid, if the forecast flag is on.
			Map<Integer, SummaryUI> fcgrid = buildForecastGrid(dataKey, categories, months);

			// Step 6 : Embed forecast data into the current month.
			embedForecastGrid(grid, fcgrid, months);
		}

		// Step 7 : Identify inactive categories with no transactions ever & remove them from grid.
		weedInactiveCats(grid);

		// Step 8 : Sort them based on Category sort order
		List<SummaryUI> uis = new ArrayList<SummaryUI>(grid.values());
		Collections.sort(uis);

		// Step 9 : Calculate monthly total row & add it as top row.
		uis.add(0, calcTotalRow(grid, months));

		return uis;
	}

	// Step 0 : Add current month to the list, if not already present.
	private MonthUI[] addCurrentMonth(List<MonthUI> list) throws ParseException {
		// Add current month to the list & sort it desc.
		if (getMthIdx(list.toArray(new MonthUI[1]), new Date()) < 0) {
			list.add(new MonthUI(new Date()));
		}
		Collections.sort(list);
		Collections.reverse(list);

		return list.toArray(new MonthUI[1]);
	}

	// Step 1 : Build empty grid.
	private Map<Integer, SummaryUI> buildEmptyGrid(List<CategoryUI> categories, MonthUI[] months) {
		Map<Integer, SummaryUI> grid = new HashMap<Integer, SummaryUI>();
		for (CategoryUI cat : categories) {
			SummaryUI ui = new SummaryUI(cat);

			ui.setAmount(new double[months.length]);
			ui.setCount(new int[months.length]);
			grid.put(cat.getId(), ui);
		}
		return grid;
	}

	// Step 2 : Populate the grid with trans data.
	private void populateGrid(Map<Integer, SummaryUI> grid, MonthUI[] months, List<Transaction> trans) {
		for (Transaction t : trans) {
			SummaryUI ui = grid.get(t.getCategory().getCategoryId());
			int idx = getMthIdx(months, t.getTransMonth());
			ui.amount[idx] += t.getAmount();
			ui.count[idx] += 1;
		}

	}

	// Step 4 : Populate the yearly summary columns with totals from the months of the year.
	private void calcYearlySummary(Map<Integer, SummaryUI> grid, MonthUI[] months) {
		// Yearly Summary - For each SummaryUI, populate the yearly totals by summing up the months for that year.
		// Pick only the non-aggregate months for totaling.
		for (int i = 0; i < months.length; i++) {
			MonthUI m = months[i];
			if (m.isAggregate()) {
				for (int j = 0; j < months.length; j++) {
					MonthUI m2 = months[j];
					if (!m2.isAggregate() && DateUtils.truncatedEquals(m.getId(), m2.getId(), Calendar.YEAR)) {
						for (SummaryUI ui : grid.values()) {
							ui.amount[i] += ui.amount[j];
							ui.count[i] += ui.count[j];
						}
					}
				}
			}
		}
	}

	// Step 5 : Build forecast grid, if the forecast flag is on.
	private Map<Integer, SummaryUI> buildForecastGrid(int dataKey, List<CategoryUI> categories, MonthUI[] months) {
		Map<Integer, SummaryUI> fcgrid = buildEmptyGrid(categories, months);
		List<Transaction> trans = this.transactionDAO.findForForecast(dataKey);
		for (Transaction t : trans) {
			SummaryUI ui = fcgrid.get(t.getCategory().getCategoryId());
			ui.amount[0] += t.getAmount();
			ui.count[0] += 1;
		}
		for (SummaryUI ui : fcgrid.values()) {
			ui.amount[0] = ui.amount[0] / 3;
		}
		return fcgrid;
	}

	// Step 6 : Embed forecast data into the current month.
	private void embedForecastGrid(Map<Integer, SummaryUI> grid, Map<Integer, SummaryUI> fcgrid, MonthUI[] months) {
		int idx = getMthIdx(months, new Date());
		for (SummaryUI fcui : fcgrid.values()) {
			SummaryUI ui = grid.get(fcui.getCategory().getId());
			if (ui.amount[idx] < fcui.amount[0]) {
				ui.amount[idx] = fcui.amount[0];
				ui.count[idx] = fcui.count[0];
			}
		}
	}

	// Step 7 : Identify inactive categories with no transactions ever & remove them from grid.
	private void weedInactiveCats(Map<Integer, SummaryUI> grid) {
		List<CategoryUI> weeds = new ArrayList<CategoryUI>();
		for (SummaryUI ui : grid.values()) {
			if (!ui.getCategory().isActive()) {
				boolean nonZero = false;
				for (double d : ui.amount) {
					if (d != 0) {
						nonZero = true;
					}
				}
				if (!nonZero) {
					weeds.add(ui.getCategory());
				}
			}
		}
		for (CategoryUI cat : weeds) {
			grid.remove(cat.getId());
		}
	}

	// Step 9 : Calculate monthly total row & add it as top row.
	private SummaryUI calcTotalRow(Map<Integer, SummaryUI> grid, MonthUI[] months) {
		SummaryUI tui = new SummaryUI(new CategoryUI(0));
		tui.setAmount(new double[months.length]);
		tui.setCount(new int[months.length]);

		for (SummaryUI ui : grid.values()) {
			for (int i = 0; i < months.length; i++) {
				tui.amount[i] += ui.amount[i];
				tui.count[i] += ui.count[i];
			}
		}
		return tui;
	}

	private int getMthIdx(MonthUI[] months, Date d) {
		MonthUI m = new MonthUI(d);
		for (int i = 0; i < months.length; i++) {
			if (months[i].getSeq() == m.getSeq()) {
				return i;
			}
		}
		return -1;
	}
}
