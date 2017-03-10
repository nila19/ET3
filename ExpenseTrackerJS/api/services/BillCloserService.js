'use strict';

const moment = require('moment');
const async = require('async');
const bills = require('../models/Bills')();
const cities = require('../models/Cities')();
const accounts = require('../models/Accounts')();
const transactions = require('../models/Transactions')();
const sequences = require('../models/Sequences')();
const fmt = require('../config/formats');

let param = null;
const stats = {closed: 0, opened: 0};

const execute = function (params, next) {
  param = params;
  param.log.info('BillCloser started');

  async.waterfall([getDefaultCity, closeBills, createNewBills], function (err) {
    logErr(param.log, err);
    param.log.info('BillCloser ended.. ' + JSON.stringify(stats));
    return next(err);
  });
};

// step 1: get default city.
const getDefaultCity = function (next) {
  cities.findDefault(param.db).then((city) => {
    return next(null, city);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 2: close all open bills.
const closeBills = function (city, next) {
  getAllOpenBills(city, function (err, bills) {
    if(err) {
      logErr(param.log, err);
      return next(err);
    }
    async.each(bills, function (bill, cb) {
      // do not close if the billDt is not in the past.
      if(!moment().isAfter(bill.billDt, 'day')) {
        return cb();
      }
      closeBill(bill, function (err) {
        logErr(param.log, err);
        if(!err) {
          stats.closed += 1;
        }
        return cb(err);
      });
    }, function (err) {
      logErr(param.log, err);
      return next(err, city);
    });
  });
};
// step 2.1: fetch all open bills.
const getAllOpenBills = function (city, next) {
  bills.findForCityOpen(param.db, city.id).then((bills) => {
    return next(null, bills);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};
// step 2.2: close each bill.
const closeBill = function (bill, next) {
  async.waterfall([function (cb) {
    return cb(null, bill);
  }, getBillAmt, getAccount, updateBill, updateAccount], function (err) {
    logErr(param.log, err);
    return next(err);
  });
};
// step 2.2.1: calculate open bill amount for that bill by looping through the trans.
const getBillAmt = function (bill, next) {
  let amt = 0;

  getTransForBill(bill, function (err, trans) {
    if(err) {
      logErr(param.log, err);
      return next(err);
    }
    async.each(trans, function (tr, cb) {
      amt += tr.amount;
      return cb();
    }, function (err) {
      logErr(param.log, err);
      return next(err, bill, amt);
    });
  });
};
// step 2.2.1.1: fetch all transactions for that bill id.
const getTransForBill = function (bill, next) {
  transactions.findForAcct(param.db, bill.cityId, bill.account.id, bill.id).then((trans) => {
    return next(null, trans);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};
// step 2.2.2: fetch account details for that acccount..
const getAccount = function (bill, amt, next) {
  accounts.findById(param.db, bill.account.id).then((acct) => {
    return next(null, bill, amt, acct);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};
// step 2.2.3: updates the bill in DB with the latest amount & bill status..
const updateBill = function (bill, amt, acct, next) {
  bill.amount = acct.cash ? amt * -1 : amt;
  bills.update(param.db, {id: bill.id}, {$set: {amount: bill.amount, balance: bill.amount,
    closed: true}}).then(() => {
      return next(null, bill, true);
    }).catch((err) => {
      logErr(param.log, err);
      return next(err);
    });
};

// step 3: create new open bills.
const createNewBills = function (city, next) {
  getBillableAccounts(city, function (err, accts) {
    if(err) {
      logErr(param.log, err);
      return next(err);
    }
    async.each(accts, function (ac, cb) {
      isNewBillNeeded(ac, function (err, needed) {
        if(err || !needed) {
          logErr(param.log, err);
          return cb(err);
        }
        param.log.info(ac.name + ' :: ' + needed);
        createNewBill(city, ac, function (err) {
          logErr(param.log, err);
          if(!err) {
            stats.opened += 1;
          }
          return cb(err);
        });
      });
    }, function (err) {
      logErr(param.log, err);
      return next(err);
    });
  });
};

// step 3.1: fetch all active accounts for the city..
const getBillableAccounts = function (city, next) {
  accounts.findBillable(param.db, city.id).then((accts) => {
    return next(null, accts);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 3.2: check if new bill is needed..
const isNewBillNeeded = function (ac, next) {
  // if the account is not billed, new bill NOT needed.
  if(!ac.billed) {
    return next(null, false);
  }
  // if the 'openbill' on the account is blank, new bill IS needed.
  if(!ac.bills.open) {
    return next(null, true);
  }
  getBill(ac.bills.open.id, function (err, bill) {
    if(err) {
      logErr(param.log, err);
      return next(err);
    }
    return next(null, bill.closed ? true : false);
  });
};

// step 3.2.1: fetch bill from DB..
const getBill = function (id, next) {
  bills.findById(param.db, id).then((bill) => {
    return next(null, bill);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 3.3: create a new OpenBill..
const createNewBill = function (city, ac, next) {
  async.waterfall([function (cb) {
    return cb(null, city, ac);
  }, buildEmptyBill, insertBill, updateAccount], function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 3.3.1: build an empty bill..
const buildEmptyBill = function (city, ac, next) {
  fetchBillSeq(city, function (err, seq) {
    if(err) {
      logErr(param.log, err);
      return next(err);
    }
    let dueDt = null;
    let billDt = moment().date(ac.closingDay);

    // if billDt is in the past, add 1 month.
    billDt = moment().isAfter(billDt, 'day') ? billDt.add(1, 'month') : billDt;
    dueDt = billDt.clone().date(ac.dueDay);
    // if dueDt is lesser than billDt, add 1 month.
    dueDt = billDt.isAfter(dueDt, 'day') ? dueDt.add(1, 'month') : dueDt;

    const bill = {
      id: seq,
      cityId: city.id,
      account: {id: ac.id, name: ac.name},
      createdDt: moment().format(fmt.YYYYMMDDHHmmss),
      billDt: billDt.format(fmt.YYYYMMDD),
      dueDt: dueDt.format(fmt.YYYYMMDD),
      closed: false,
      amount: 0,
      balance: 0
    };

    bill.name = bills.getName(bill.account, bill);
    return next(null, bill);
  });
};

// step 3.3.1.1 : fetch next bill sequence from DB
const fetchBillSeq = function (city, next) {
  sequences.getNextSeq(param.db, {seqId: 'bills', cityId: city.id}).then((seq) => {
    return next(null, seq.seq);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 3.3.2: insert the bill into the DB..
const insertBill = function (bill, next) {
  bills.insert(param.db, bill).then(() => {
    return next(null, bill, false);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};
// step 2.2.4 / 3.3.3: updates the account in DB with the last/open bill info..\
const updateAccount = function (bill, last, next) {
  const bl = {id: bill.id, name: bill.name, billDt: bill.billDt, dueDt: bill.dueDt, amount: bill.amount};
  const mod = last ? {'bills.last': bl} : {'bills.open': bl};

  accounts.update(param.db, {id: bill.account.id}, {$set: mod}).then(() => {
    return next();
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

const logErr = function (log, err) {
  if(err) {
    log.error(err);
  }
};

module.exports = {
  execute: execute,
};
