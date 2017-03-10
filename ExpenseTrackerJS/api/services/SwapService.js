'use strict';

const async = require('async');
const accounts = require('../models/Accounts')();
const transactions = require('../models/Transactions')();

let param = null;
let data = null;
let trans = null;
let accts = null;
let balances = null;

const swapExpenses = function (params, data1, next) {
  param = params;
  data = data1;

  async.waterfall([checkCityEditable, processList], function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

//* *************************************************//
// setp 1: check city is editable.
const checkCityEditable = function (next) {
  // TODO implement City editable check..
  return next();
};

// setp 2: process the swap array & call 'processSwap' for each item.
const processList = function (next) {
  async.each(data, function (item, cb) {
    processSwap(item.fromTrans, item.toTrans, function (err) {
      logErr(param.log, err);
      return cb(err);
    });
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// setp 3: processes each swap row.
const processSwap = function (oneId, twoId, next) {
  trans = {one: {id: 0}, two: {id: 0}};
  accts = {};
  balances = {};
  async.waterfall([function (cb) {
    return cb(null, oneId, twoId);
  }, getTransInfo, checkAccountsSeq, initializeBalances, rollbackTransactions, replayTransactions,
    updateTransactions], function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// setp 3.2: get trans info from DB & the related accounts info.
const getTransInfo = function (oneId, twoId, next) {
  async.parallel({
    from: function (cb) {
      if(!oneId) {
        return cb();
      }
      getTrans(oneId, function (err, tr) {
        logErr(param.log, err);
        trans.one = tr;
        getAccountsInfo(tr, function (err) {
          logErr(param.log, err);
          return cb(err);
        });
      });
    },
    to: function (cb) {
      if(!twoId) {
        return cb();
      }
      getTrans(twoId, function (err, tr) {
        logErr(param.log, err);
        trans.two = tr;
        getAccountsInfo(tr, function (err) {
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
// step 3.2.1: fetch transaction info from DB
const getTrans = function (id, next) {
  transactions.findById(param.db, id).then((tran) => {
    return next(null, tran);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 3.2.2: fetch from & to accounts info from DB
const getAccountsInfo = function (trans, next) {
  async.parallel({
    from: function (cb) {
      if(!trans.accounts.from.id) {
        return cb();
      }
      getAccount(trans.accounts.from.id, function (err, ac) {
        accts[ac.id] = ac;
        balances[ac.id] = 0;
        logErr(param.log, err);
        return cb(err);
      });
    },
    to: function (cb) {
      if(!trans.accounts.to.id) {
        return cb();
      }
      getAccount(trans.accounts.to.id, function (err, ac) {
        accts[ac.id] = ac;
        balances[ac.id] = 0;
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};
// step 3.2.2.1: fetch account info from DB
const getAccount = function (id, next) {
  accounts.findById(param.db, id).then((acct) => {
    return next(null, acct);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 3.3: check seq of the 2 accounts & find out which is older.
const checkAccountsSeq = function (next) {
  // oldest first.
  if(trans.one.seq < trans.two.seq) {
    trans.first = trans.one;
    trans.second = trans.two;
  } else {
    trans.first = trans.two;
    trans.second = trans.one;
  }
  // swap the seq#s.
  const seq = trans.first.seq;

  trans.first.seq = trans.second.seq;
  trans.second.seq = seq;
  return next();
};

// step 3.4: load Bf balances for accounts.
const initializeBalances = function (next) {
  // process in reverse chronological order. newest first.
  balances[trans.second.accounts.from.id] = trans.second.accounts.from.balanceBf;
  balances[trans.second.accounts.to.id] = trans.second.accounts.to.balanceBf;
  balances[trans.first.accounts.from.id] = trans.first.accounts.from.balanceBf;
  balances[trans.first.accounts.to.id] = trans.first.accounts.to.balanceBf;
  return next();
};

// step 3.5: rollback the transactions.
const rollbackTransactions = function (next) {
  // rollback the latest trans first & then the older one..
  // rollbackTran(trans.second);
  // rollbackTran(trans.first);
  return next();
};

// const rollbackTran = function (tr, next) {
//   balances[tr.accounts.from.id] += accts[tr.accounts.from.id].cash ? tr.amount : tr.amount * -1;
//   balances[tr.accounts.to.id] -= accts[tr.accounts.to.id].cash ? tr.amount : tr.amount * -1;
// };

// step 3.6: replay the transactions in the new order & update the account balances.
const replayTransactions = function (next) {
  // replay the latest one first & then the older one..
  trans.second.accounts.from.balanceBf = balances[trans.second.accounts.from.id];
  trans.second.accounts.to.balanceBf = balances[trans.second.accounts.to.id];
  replayTran(trans.second);
  trans.second.accounts.from.balanceAf = balances[trans.second.accounts.from.id];
  trans.second.accounts.to.balanceAf = balances[trans.second.accounts.to.id];

  trans.first.accounts.from.balanceBf = balances[trans.first.accounts.from.id];
  trans.first.accounts.to.balanceBf = balances[trans.first.accounts.to.id];
  replayTran(trans.first);
  trans.first.accounts.from.balanceAf = balances[trans.first.accounts.from.id];
  trans.first.accounts.to.balanceAf = balances[trans.first.accounts.to.id];
  return next();
};

// step 3.6.1: replay the transactions.
const replayTran = function (tr, next) {
  if(tr.accounts.from.id) {
    balances[tr.accounts.from.id] -= accts[tr.accounts.from.id].cash ? tr.amount : tr.amount * -1;
  }
  if(tr.accounts.to.id) {
    balances[tr.accounts.to.id] += accts[tr.accounts.to.id].cash ? tr.amount : tr.amount * -1;
  }
};

// step 3.7: save the updated balances in DB.
const updateTransactions = function (next) {
  async.series({
    first: function (cb) {
      updateTran(trans.first, function (err) {
        logErr(param.log, err);
        return cb(err);
      });
    },
    second: function (cb) {
      updateTran(trans.second, function (err) {
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};
// step 3.7.1: update each transaction.
const updateTran = function (tr, next) {
  async.series({
    from: function (cb) {
      if(!tr.accounts.from.id) {
        return cb();
      }
      updateTranFrom(tr, function (err) {
        logErr(param.log, err);
        return cb(err);
      });
    },
    to: function (cb) {
      if(!tr.accounts.to.id) {
        return cb();
      }
      updateTranTo(tr, function (err) {
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 3.7.1.1: update only the 'from' balances.
const updateTranFrom = function (tr, next) {
  transactions.update(param.db, {id: tr.id},
    {$set: {'accounts.from.balanceBf': tr.accounts.from.balanceBf,
      'accounts.from.balanceAf': tr.accounts.from.balanceAf,
      seq: tr.seq}}).then(() => {
        return next();
      }).catch((err) => {
        logErr(param.log, err);
        return next(err);
      });
};
// step 3.7.1.2: update only the 'to' balances.
const updateTranTo = function (tr, next) {
  transactions.update(param.db, {id: tr.id},
    {$set: {'accounts.to.balanceBf': tr.accounts.to.balanceBf,
      'accounts.to.balanceAf': tr.accounts.to.balanceAf,
      seq: tr.seq}}).then(() => {
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
  swapExpenses: swapExpenses,
};
