'use strict';

const async = require('async');
const accounts = require('../models/Accounts')();
const transactions = require('../models/Transactions')();

const accts = {from: null, to: null};
let param = null;

//* *************************************************//
// this service transfers cash from one account to another.
// params: {db, log, fromId, toId, amount, seq}
const transferCash = function (params, next) {
  param = params;

  async.series([getAccountsInfo, moveCash], function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

//* *************************************************//
// step 1 : fetch from & to accounts info from DB
const getAccountsInfo = function (next) {
  async.parallel({
    from: function (cb) {
      if(!param.fromId) {
        return cb();
      }
      getAccount(param.fromId, function (err, ac) {
        accts.from = ac;
        logErr(param.log, err);
        return cb(err);
      });
    },
    to: function (cb) {
      if(!param.toId) {
        return cb();
      }
      getAccount(param.toId, function (err, ac) {
        accts.to = ac;
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 1.1 : fetches account info from DB
const getAccount = function (acctId, next) {
  accounts.findOne(param.db, {acctId: acctId}).then((doc) => {
    return next(null, doc);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// setp 2: move cash for both from & to accounts. If any of them is 0, ignore.
const moveCash = function (next) {
  async.parallel({
    from: function (cb) {
      // if acct is 0, ignore.
      if(!param.fromId) {
        return cb();
      }
      // for fromAccount negate the amount.
      updateAccount(accts.from, (param.amount * -1), param.seq, function cb(err) {
        logErr(param.log, err);
        return cb(err);
      });
    },
    to: function (cb) {
      // if acct is 0, ignore.
      if(!param.toId) {
        return cb();
      }
      updateAccount(accts.to, param.amount, param.seq, function cb(err) {
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 2.1 : update the balance amount into DB.
const updateAccount = function (acct, amount, seq, next) {
  let amt = amount;

  if(acct.type === accounts.FLAGS.type.CREDIT) {
    amt = amount * -1;
  }
  accounts.update(param.db, {acctId: acct.acctId}, {$set: {balance: (acct.balance + amt)}}).then(() => {
    // if seq = 0, it is an 'add'. ignore the updateTransItemBalances step. that's used only for modify.
    if(!seq) {
      return next();
    }
    updateTransItemBalances(acct, amt, seq, function (err) {
      logErr(param.log, err);
      return next(err);
    });
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 2.1.1 : find all future trans post this trans & adjust the ac balances.
const updateTransItemBalances = function (acct, amount, seq, next) {
  transactions.findForAcct(param.db, acct.cityId, acct.acctId).then((trans) => {
    async.each(trans, function (tran, cb) {
      // if seq is less, then it is an earlier transaction, ignore..
      if(tran.seq < seq) {
        return cb();
      }
      if(tran.accounts.from.acctId === acct.acctId) {
        tran.accounts.from.balanceBf += amount;
        tran.accounts.from.balanceAf += amount;
      } else if( tran.accounts.to.acctId === acct.acctId) {
        tran.accounts.to.balanceBf += amount;
        tran.accounts.to.balanceAf += amount;
      }
      updateTrans(tran, function (err) {
        logErr(param.log, err);
        return cb(err);
      });
    }, function (err) {
      logErr(param.log, err);
      return next(err);
    });
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 2.1.1.1 : save the ac balances changes to DB.
const updateTrans = function (tr, next) {
  transactions.update(param.db, {transId: tr.transId},
    {$set: {'accounts.from.balanceBf': tr.accounts.from.balanceBf,
      'accounts.from.balanceAf': tr.accounts.from.balanceAf,
      'accounts.to.balanceBf': tr.accounts.to.balanceBf,
      'accounts.to.balanceAf': tr.accounts.to.balanceAf}}).then(() => {
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
  transferCash: transferCash,
};
