package com.expense.mvc.model.dao;

import java.util.HashMap;
import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.expense.mvc.model.BaseDAO;
import com.expense.mvc.model.entity.Bill;

@Repository
public class BillDAO extends BaseDAO<Bill, Integer> {

	@Override
	@Autowired
	protected void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;

		entityType = Bill.class;
		idType = Integer.class;
	}

	public List<Bill> findAll(int dataKey, boolean open) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("dataKey", dataKey);
		parms.put("status", Bill.Status.CLOSED.status);
		String op = open ? "and billBalance > 0" : "and billBalance = 0";

		return findByParameters(
				"from Bill where dataKey = :dataKey and status = :status " + op + " order by billDt desc", parms);
	}

	public List<Bill> findAllOpen(int dataKey) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("dataKey", dataKey);
		parms.put("status", Bill.Status.OPEN.status);

		return findByParameters("from Bill where dataKey = :dataKey and status = :status order by billDt desc", parms);
	}

	public List<Bill> findForAcct(int accId, boolean open) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("accId", accId);
		parms.put("status", Bill.Status.CLOSED.status);
		String op = open ? "and billBalance > 0" : "and billBalance = 0";

		return findByParameters(
				"from Bill where account.accountId = :accId and status = :status " + op + " order by billDt desc",
				parms);
	}

	public List<Bill> findForAcct(int accId) {
		HashMap<String, Object> parms = new HashMap<String, Object>();
		parms.put("accId", accId);
		parms.put("status", Bill.Status.CLOSED.status);

		return findByParameters("from Bill where account.accountId = :accId and status = :status order by billDt desc",
				parms);
	}
}