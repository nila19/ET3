'use strict';

const async = require('async');
const accounts = require('../models/Accounts')();
const transactions = require('../models/Transactions')();
let param = null;

//* *************************************************//
// this service transfers cash from one account to another.
// params: {db, log, from, to, amount, seq}
// setp 2: move cash for both from & to accounts. If any of them is 0, ignore.
const transferCash = function (params, next) {
  param = params;

  async.series({
    from: function (cb) {
      // if acct is 0, ignore.
      if(!param.from || !param.from.id) {
        return cb();
      }
      // for account.from negate the amount.
      getAccount(param.from.id, function (err, acct) {
        logErr(param.log, err);
        updateAccount(acct, (param.amount * -1), param.seq, function (err) {
          logErr(param.log, err);
          return cb(err);
        });
      });
    },
    to: function (cb) {
      // if acct is 0, ignore.
      if(!param.to || !param.to.id) {
        return cb();
      }
      getAccount(param.to.id, function (err, acct) {
        logErr(param.log, err);
        updateAccount(acct, param.amount, param.seq, function (err) {
          logErr(param.log, err);
          return cb(err);
        });
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 3.5: fetch account info from DB
const getAccount = function (id, next) {
  accounts.findById(param.db, id).then((acct) => {
    return next(null, acct);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 2.1 : update the balance amount into DB.
const updateAccount = function (acct, amount, seq, next) {
  const amt = acct.cash ? amount : amount * -1;

  accounts.update(param.db, {id: acct.id}, {$inc: {balance: amt}}).then(() => {
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
  transactions.findForAcct(param.db, acct.cityId, acct.id).then((trans) => {
    async.each(trans, function (tran, cb) {
      // if seq is less, then it is an earlier transaction, ignore..
      if(tran.seq < seq) {
        return cb();
      }
      if(tran.accounts.from.id === acct.id) {
        tran.accounts.from.balanceBf += amount;
        tran.accounts.from.balanceAf += amount;
      } else if( tran.accounts.to.id === acct.id) {
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
  transactions.update(param.db, {id: tr.id},
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
  transferCash: transferCash
};
