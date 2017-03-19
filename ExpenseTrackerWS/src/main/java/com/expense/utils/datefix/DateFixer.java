package com.expense.utils.datefix;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;

public class DateFixer {

	public static void main(String[] args) throws ClassNotFoundException, ParseException, SQLException {
		Class.forName("org.sqlite.JDBC");
		Connection con = null;
		try {
			con = DriverManager.getConnection("jdbc:sqlite:C:/Java/SQLite/Data/Prod.db");
			con.setAutoCommit(false);
			int parm = Integer.valueOf(args[0]);

			switch (parm) {
			case 1:
				transactions(con);
				break;
			case 2:
				accounts(con);
				break;
			case 3:
				tallyHistory(con);
				break;
			case 4:
				bills(con);
				break;
			}
			con.commit();
		} catch (Exception e) {
			if (con != null) {
				con.rollback();
			}
		} finally {
			if (con != null) {
				con.close();
			}
		}
	}

	private static enum F {
		TS("yyyy-MM-dd HH:mm:ss"), DT("yyyy-MM-dd");
		public String format;

		private F(String format) {
			this.format = format;
		}
	}

	private static SimpleDateFormat DF(F f) {
		return new SimpleDateFormat(f.format);
	}

	// ******************************** BILL **********************//
	private static void bills(Connection con) throws SQLException, ParseException {
		HashMap<Integer, Bill> m = billFirstFetch(con);
		billUpdate(con, m);
		billSecondFetch(con, m);

		for (Bill b : m.values()) {
			System.out.println(b.isMatch() + " :: " + b.toString());
		}
		System.out.println("***** FALSES...");
		for (Bill b : m.values()) {
			if (!b.isMatch()) {
				System.out.println(b.isMatch() + " :: " + b.toString());
			}
		}
	}

	private static HashMap<Integer, Bill> billFirstFetch(Connection con) throws SQLException, ParseException {
		HashMap<Integer, Bill> m = new HashMap<Integer, Bill>();
		Statement stmt = con.createStatement();
		ResultSet rs = stmt.executeQuery("SELECT * FROM BILL");
		while (rs.next()) {
			Bill b = new Bill();
			b.setId(rs.getInt("BILL_ID"));
			b.setCreatedDateOld(rs.getString("CREATED_DT"));
			b.setBillDateOld(rs.getString("BILL_DT"));
			b.setDueDateOld(rs.getString("DUE_DT"));
			b.setPaidDateOld(rs.getString("BILL_PAID_DT"));
			b.setCreatedDate(new Timestamp(DF(F.TS).parse(b.getCreatedDateOld()).getTime()));
			b.setBillDate(new Date(DF(F.DT).parse(b.getBillDateOld()).getTime()));
			b.setDueDate(new Date(DF(F.DT).parse(b.getDueDateOld()).getTime()));
			if (b.getPaidDateOld() != null) {
				b.setPaidDate(new Date(DF(F.DT).parse(b.getPaidDateOld()).getTime()));
			}
			m.put(b.getId(), b);
		}
		rs.close();
		stmt.close();
		return m;
	}

	private static void billUpdate(Connection con, HashMap<Integer, Bill> m) throws SQLException, ParseException {
		String sql = "UPDATE BILL SET CREATED_DT = ?, BILL_DT = ?, DUE_DT = ?, BILL_PAID_DT = ?  "
				+ " WHERE BILL_ID = ?";
		PreparedStatement stmt = con.prepareStatement(sql);
		for (Bill b : m.values()) {
			stmt.setTimestamp(1, b.getCreatedDate());
			stmt.setDate(2, b.getBillDate());
			stmt.setDate(3, b.getDueDate());
			stmt.setDate(4, b.getPaidDate());
			stmt.setInt(5, b.getId());
			stmt.addBatch();
		}
		stmt.executeBatch();
		stmt.close();
	}

	private static void billSecondFetch(Connection con, HashMap<Integer, Bill> m) throws SQLException, ParseException {
		Statement stmt = con.createStatement();
		for (Bill b : m.values()) {
			ResultSet rs = stmt.executeQuery("SELECT * FROM BILL WHERE BILL_ID = " + b.getId());
			rs.next();
			b.setCreatedDateNew(DF(F.TS).format(rs.getTimestamp("CREATED_DT")));
			b.setBillDateNew(DF(F.DT).format(rs.getDate("BILL_DT")));
			b.setDueDateNew(DF(F.DT).format(rs.getDate("DUE_DT")));
			if (rs.getTimestamp("BILL_PAID_DT") != null) {
				b.setPaidDateNew(DF(F.DT).format(rs.getDate("BILL_PAID_DT")));
			}
			rs.close();
		}
		stmt.close();
	}

	// ******************************** TALLY **********************//
	private static void tallyHistory(Connection con) throws SQLException, ParseException {
		HashMap<Integer, String> m = tallyFirstFetch(con);
		tallyUpdate(con, m);
		tallySecondFetch(con, m);
	}

	private static HashMap<Integer, String> tallyFirstFetch(Connection con) throws SQLException, ParseException {
		HashMap<Integer, String> m = new HashMap<Integer, String>();
		Statement stmt = con.createStatement();
		ResultSet rs = stmt.executeQuery("SELECT * FROM TALLY_HISTORY");
		while (rs.next()) {
			m.put(rs.getInt("TALLY_SEQ"), rs.getString("TALLY_DATE"));
		}
		rs.close();
		stmt.close();
		return m;
	}

	private static void tallyUpdate(Connection con, HashMap<Integer, String> m) throws SQLException, ParseException {
		String sql = "UPDATE TALLY_HISTORY SET TALLY_DATE = ? WHERE TALLY_SEQ = ?";
		PreparedStatement stmt = con.prepareStatement(sql);
		for (Integer id : m.keySet()) {
			stmt.setTimestamp(1, new Timestamp(DF(F.TS).parse(m.get(id)).getTime()));
			stmt.setInt(2, id);
			stmt.addBatch();
		}
		stmt.executeBatch();
		stmt.close();
	}

	private static void tallySecondFetch(Connection con, HashMap<Integer, String> m)
			throws SQLException, ParseException {
		Statement stmt = con.createStatement();
		for (Integer id : m.keySet()) {
			ResultSet rs = stmt.executeQuery("SELECT * FROM TALLY_HISTORY WHERE TALLY_SEQ = " + id);
			rs.next();
			String str = DF(F.TS).format(rs.getTimestamp("TALLY_DATE"));
			System.out.println(StringUtils.equals(str, m.get(id)) + " :: " + id + ", " + m.get(id) + ", " + str);
			rs.close();
		}
		stmt.close();
	}

	// ******************************** ACCOUNT **********************//
	private static void accounts(Connection con) throws SQLException, ParseException {
		HashMap<Integer, String> m = acctFirstFetch(con);
		acctUpdate(con, m);
		acctSecondFetch(con, m);
	}

	private static HashMap<Integer, String> acctFirstFetch(Connection con) throws SQLException, ParseException {
		HashMap<Integer, String> m = new HashMap<Integer, String>();
		Statement stmt = con.createStatement();
		ResultSet rs = stmt.executeQuery("SELECT * FROM ACCOUNT");
		while (rs.next()) {
			m.put(rs.getInt("ACCOUNT_ID"), rs.getString("TALLY_DATE"));
		}
		rs.close();
		stmt.close();
		return m;
	}

	private static void acctUpdate(Connection con, HashMap<Integer, String> m) throws SQLException, ParseException {
		String sql = "UPDATE ACCOUNT SET TALLY_DATE = ? WHERE ACCOUNT_ID = ?";
		PreparedStatement stmt = con.prepareStatement(sql);
		for (Integer id : m.keySet()) {
			if (m.get(id) != null) {
				stmt.setTimestamp(1, new Timestamp(DF(F.TS).parse(m.get(id)).getTime()));
				stmt.setInt(2, id);
				stmt.addBatch();
			}
		}
		stmt.executeBatch();
		stmt.close();
	}

	private static void acctSecondFetch(Connection con, HashMap<Integer, String> m)
			throws SQLException, ParseException {
		Statement stmt = con.createStatement();
		for (Integer id : m.keySet()) {
			if (m.get(id) != null) {
				ResultSet rs = stmt.executeQuery("SELECT * FROM ACCOUNT WHERE ACCOUNT_ID = " + id);
				rs.next();
				String str = DF(F.TS).format(rs.getTimestamp("TALLY_DATE"));
				System.out.println(StringUtils.equals(str, m.get(id)) + " :: " + id + ", " + m.get(id) + ", " + str);
				rs.close();
			}
		}
		stmt.close();
	}

	// ******************************** TRANSACTION **********************//
	private static void transactions(Connection con) throws SQLException, ParseException {
		HashMap<Integer, Trans> m = transFirstFetch(con, 6001, 10000);
		transUpdate(con, m);
		transSecondFetch(con, m);

		for (Trans t : m.values()) {
			System.out.println(t.isMatch() + " :: " + t.toString());
		}
		System.out.println("***** FALSES...");
		for (Trans t : m.values()) {
			if (!t.isMatch()) {
				System.out.println(t.isMatch() + " :: " + t.toString());
			}
		}
	}

	private static HashMap<Integer, Trans> transFirstFetch(Connection con, int beg, int end)
			throws SQLException, ParseException {
		HashMap<Integer, Trans> m = new HashMap<Integer, Trans>();
		Statement stmt = con.createStatement();
		ResultSet rs = stmt.executeQuery("SELECT * FROM TRANSACTIONS WHERE TRANS_ID BETWEEN " + beg + " AND " + end);
		while (rs.next()) {
			Trans t = new Trans();
			t.setId(rs.getInt("TRANS_ID"));
			t.setEntryDateOld(rs.getString("ENTRY_DATE"));
			t.setEntryMonthOld(rs.getString("ENTRY_MONTH"));
			t.setTransDateOld(rs.getString("TRANS_DATE"));
			t.setTransMonthOld(rs.getString("TRANS_MONTH"));
			t.setTallyDateOld(rs.getString("TALLY_DATE"));
			t.setEntryDate(new Timestamp(DF(F.TS).parse(t.getEntryDateOld()).getTime()));
			t.setEntryMonth(new Date(DF(F.DT).parse(t.getEntryMonthOld()).getTime()));
			t.setTransDate(new Date(DF(F.DT).parse(t.getTransDateOld()).getTime()));
			t.setTransMonth(new Date(DF(F.DT).parse(t.getTransMonthOld()).getTime()));
			if (t.getTallyDateOld() != null) {
				t.setTallyDate(new Timestamp(DF(F.TS).parse(t.getTallyDateOld()).getTime()));
			}
			m.put(t.getId(), t);
		}
		rs.close();
		stmt.close();
		return m;
	}

	private static void transUpdate(Connection con, HashMap<Integer, Trans> m) throws SQLException, ParseException {
		String sql = "UPDATE TRANSACTIONS SET ENTRY_DATE = ?, ENTRY_MONTH = ?, TRANS_DATE = ?, TRANS_MONTH = ?, TALLY_DATE = ? "
				+ " WHERE TRANS_ID = ?";
		PreparedStatement stmt = con.prepareStatement(sql);
		for (Trans t : m.values()) {
			stmt.setTimestamp(1, t.getEntryDate());
			stmt.setDate(2, t.getEntryMonth());
			stmt.setDate(3, t.getTransDate());
			stmt.setDate(4, t.getTransMonth());
			stmt.setTimestamp(5, t.getTallyDate());
			stmt.setInt(6, t.getId());
			stmt.addBatch();
		}
		stmt.executeBatch();
		stmt.close();
	}

	private static void transSecondFetch(Connection con, HashMap<Integer, Trans> m)
			throws SQLException, ParseException {
		Statement stmt = con.createStatement();
		for (Trans t : m.values()) {
			ResultSet rs = stmt.executeQuery("SELECT * FROM TRANSACTIONS WHERE TRANS_ID = " + t.getId());
			rs.next();
			t.setEntryDateNew(DF(F.TS).format(rs.getTimestamp("ENTRY_DATE")));
			t.setEntryMonthNew(DF(F.DT).format(rs.getDate("ENTRY_MONTH")));
			t.setTransDateNew(DF(F.DT).format(rs.getDate("TRANS_DATE")));
			t.setTransMonthNew(DF(F.DT).format(rs.getDate("TRANS_MONTH")));
			if (rs.getTimestamp("TALLY_DATE") != null) {
				t.setTallyDateNew(DF(F.TS).format(rs.getTimestamp("TALLY_DATE")));
			}
			rs.close();
		}
		stmt.close();
	}
}
