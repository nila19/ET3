package com.expense.mvc.model.dao;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.expense.mvc.model.BaseDAO;
import com.expense.mvc.model.entity.Transaction;
import com.expense.mvc.model.ui.SearchUI;
import com.expense.utils.FU;

@Repository
public class TransactionDAO extends BaseDAO<Transaction, Integer> {
	private static final double PCT_75 = 0.75;
	private static final double PCT_125 = 1.25;

	@Override
	@Autowired
	protected void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;

		entityType = Transaction.class;
		idType = Integer.class;
	}

	public List<Transaction> findAll(int dataKey) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("dataKey", dataKey);

		return findByParameters("from Transaction where dataKey = :dataKey order by transSeq desc", parms);
	}

	public List<Transaction> findByAccount(int dataKey, int accountId, int billId) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("dataKey", dataKey);
		parms.put("accountId", accountId);
		parms.put("billId", billId);
		parms.put("tallyInd", Transaction.Tally.NO.status);

		String query = "from Transaction where dataKey = :dataKey";
		if (billId > 0) {
			query += " and (fromBill.billId = :billId or toBill.billId = :billId )";
		} else if (accountId > 0) {
			query += " and (fromAccount.accountId = :accountId or toAccount.accountId = :accountId )";
		}
		query += " order by transSeq desc";

		return findByParameters(query, parms);
	}

	public List<Transaction> findForSearch(SearchUI ui) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("dataKey", ui.getCity());
		parms.put("accountId", ui.getAccountId());
		parms.put("billId", ui.getBillId());
		parms.put("categoryId", ui.getCategoryId());
		parms.put("description", "%" + ui.getDescription() + "%");
		parms.put("amount_75", ui.getAmount() * TransactionDAO.PCT_75);
		parms.put("amount_125", ui.getAmount() * TransactionDAO.PCT_125);
		if (ui.getDtEntryMonth() != null) {
			if (ui.isEntryMonthAggr()) {
				Date dt = ui.getDtEntryMonth();
				parms.put("entryYearBegin", FU.getYearBegin(dt).getTime());
				parms.put("entryYearEnd", FU.getYearEnd(dt).getTime());
			} else {
				parms.put("entryMonth", ui.getDtEntryMonth());
			}
		}
		if (ui.getDtTransMonth() != null) {
			if (ui.isTransMonthAggr()) {
				Date dt = ui.getDtTransMonth();
				parms.put("transYearBegin", FU.getYearBegin(dt).getTime());
				parms.put("transYearEnd", FU.getYearEnd(dt).getTime());
			} else {
				parms.put("transMonth", ui.getDtTransMonth());
			}
		}
		parms.put("adhocInd", ui.getAdhocInd());
		parms.put("adjustInd", ui.getAdjustInd());

		String query = "from Transaction where dataKey = :dataKey";
		if (ui.getAccountId() > 0) {
			query += " and (fromAccount.accountId = :accountId or toAccount.accountId = :accountId )";
		}
		if (ui.getBillId() > 0) {
			query += " and fromBill.billId = :billId";
		}
		if (ui.getCategoryId() > 0) {
			query += " and category.categoryId = :categoryId";
		}
		if (StringUtils.isNotBlank(ui.getDescription())) {
			query += " and description like :description";
		}
		if (ui.getAmount() > 0) {
			query += " and (amount between :amount_75 and :amount_125)";
		}
		if (ui.getDtEntryMonth() != null) {
			if (ui.isEntryMonthAggr()) {
				query += " and entryMonth between :entryYearBegin and :entryYearEnd";
			} else {
				query += " and entryMonth = :entryMonth";
			}
		}
		if (ui.getDtTransMonth() != null) {
			if (ui.isTransMonthAggr()) {
				query += " and transMonth between :transYearBegin and :transYearEnd";
			} else {
				query += " and transMonth = :transMonth";
			}
		}
		if (ui.getAdhocInd() == Transaction.Adhoc.YES.type || ui.getAdhocInd() == Transaction.Adhoc.NO.type) {
			query += " and adhocInd = :adhocInd";
		}
		if (ui.getAdjustInd() == Transaction.Adjust.YES.type || ui.getAdjustInd() == Transaction.Adjust.NO.type) {
			query += " and adjustInd = :adjustInd";
		}
		query += " order by transSeq desc";

		return ui.isThinList() ? findByParametersThin(query, parms) : findByParameters(query, parms);
	}

	public List<Transaction> findForMonthlySummary(int dataKey, boolean regular, boolean adhoc) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("dataKey", dataKey);
		parms.put("adjustInd", Transaction.Adjust.NO.type);
		parms.put("adhocInd", (regular && !adhoc) ? 'N' : (adhoc && !regular) ? 'Y' : ' ');

		String query = "from Transaction where dataKey = :dataKey and adjustInd = :adjustInd";
		if (!(regular && adhoc)) {
			query += " and adhocInd = :adhocInd";
		}
		query += " order by transSeq desc";

		return findByParameters(query, parms);
	}

	public List<Transaction> findForForecast(int dataKey) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("dataKey", dataKey);
		parms.put("adjustInd", Transaction.Adjust.NO.type);
		parms.put("adhocInd", Transaction.Adhoc.NO.type);
		// Get Transactions for the last 3 months excluding the current month.
		Date curr_month = DateUtils.truncate(new Date(), Calendar.MONTH);
		parms.put("beginMon", DateUtils.addMonths(curr_month, -3));
		parms.put("endMon", DateUtils.addMonths(curr_month, -1));

		String query = "from Transaction where dataKey = :dataKey and adjustInd = :adjustInd and adhocInd = :adhocInd and transMonth between :beginMon and :endMon";
		return findByParameters(query, parms);
	}

	@SuppressWarnings("unchecked")
	public List<java.sql.Date> findAllEntryMonths(int dataKey) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("dataKey", dataKey);

		String query = "select distinct entryMonth from Transaction where dataKey = :dataKey order by ENTRY_MONTH desc";
		return sessionFactory.getCurrentSession().createQuery(query).setProperties(parms).list();
	}

	@SuppressWarnings("unchecked")
	public List<java.sql.Date> findAllTransMonths(int dataKey) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("dataKey", dataKey);

		String query = "select distinct transMonth from Transaction where dataKey = :dataKey order by TRANS_MONTH desc";
		return sessionFactory.getCurrentSession().createQuery(query).setProperties(parms).list();
	}

	@SuppressWarnings("unchecked")
	public List<String> findAllDescription(int dataKey) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("dataKey", dataKey);

		String query = "select description from Transaction where dataKey = :dataKey group by DESCRIPTION order by COUNT(*) desc";
		return sessionFactory.getCurrentSession().createQuery(query).setProperties(parms).list();
	}
}
