'use strict';

const moment = require('moment');
const numeral = require('numeral');
const async = require('async');
const sugar = require('sugar');
const accounts = require('../models/Accounts')();
const bills = require('../models/Bills')();
const transactions = require('../models/Transactions')();
const cashService = require('./CashService');
const fmt = require('../config/formats');

let param = null;
let data = null;
let trans = null;
let finImpact = false;

const modifyExpense = function (params, data1, next) {
  param = params;
  data = data1;

  async.waterfall([checkCityEditable, getTransInfo, getAccountsInfo, checkFinImpact, checkAccountsActive,
    checkBillChangeNeeded, modifyBillBalance, adjustCash, copyTransData, calcTransAcctBal,
    saveTransaction], function (err) {
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

// step 2: fetch transaction info from DB
const getTransInfo = function (next) {
  transactions.findById(param.db, data.id).then((doc) => {
    trans = doc;
    return next();
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 3: fetch from & to accounts info from DB
const getAccountsInfo = function (next) {
  async.parallel({
    from: function (cb) {
      if(!data.accounts.from.id) {
        data.accounts.from = {id: 0, balance: 0};
        return cb();
      }
      getAccount(data.accounts.from.id, function (err, ac) {
        data.accounts.from = ac;
        logErr(param.log, err);
        return cb(err);
      });
    },
    to: function (cb) {
      if(!data.accounts.to.id) {
        data.accounts.to = {id: 0, balance: 0};
        return cb();
      }
      getAccount(data.accounts.to.id, function (err, ac) {
        data.accounts.to = ac;
        logErr(param.log, err);
        return cb(err);
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

const checkFinImpact = function (next) {
  if(trans.amount != data.amount) {
    finImpact = true;
  }
  if(trans.accounts.from.id != data.accounts.from.id) {
    finImpact = true;
  }
  if(trans.adjust && trans.accounts.to.id != data.accounts.to.id) {
    finImpact = true;
  }
  return next();
};

const checkAccountsActive = function (next) {
  let okToGo = true;

  if(!finImpact) {
    return next();
  }
  if(data.accounts.from.id && !data.accounts.from.active) {
    okToGo = false;
  }
  if(data.adjust && data.accounts.to.id && !data.accounts.to.active) {
    okToGo = false;
  }
  if(okToGo) {
    return next();
  } else {
    return next('Modification invalid. Account(s) involved not active...');
  }
};

// step 4: check if there is any change in bill & if a modification to bill is needed.
const checkBillChangeNeeded = function (next) {
  // if no bill before & after change, then skip.
  if(!trans.bill && !data.bill) {
    return next();
  }
  let billChange = false;

  if(trans.bill && !data.bill || !trans.bill && data.bill) {
    billChange = true;
  } else if (trans.bill.id !== data.bill.id) {
    billChange = true;
  } else if (trans.amount !== data.amount) {
    billChange = true;
  }

  return next(null, billChange);
};

// step 4: if the expense has been included in a bill, deduct the bill amount & balance.
const modifyBillBalance = function (billChange, next) {
  if(!billChange) {
    return next();
  }

  async.parallel({
    rollbackOld: function (cb) {
      if(!trans.bill) {
        return cb();
      }
      updateBill(trans.bill.id, trans.amount, function (err) {
        logErr(param.log, err);
        return cb(err);
      });
    },
    addNew: function (cb) {
      if(!data.bill) {
        return cb();
      }
      updateBill(data.bill.id, data.amount * -1, function (err) {
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 4.5: decrement the bill amount & balance with the trans amount.
const updateBill = function (id, amount, next) {
  bills.findOneAndUpdate(param.db, {id: id}, {$inc: {amount: -amount, balance: -amount}}).then(() => {
    return next();
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// setp 5: move cash across from / to accounts. Reverse the from / to accounts.
const adjustCash = function (next) {
  if(!finImpact) {
    return next();
  }
  async.series({
    rollbackOld: function (cb) {
      cashService.transferCash({db: param.db, log: param.log, from: trans.accounts.to,
        to: trans.accounts.from, amount: trans.amount, seq: trans.seq}, function (err) {
        logErr(param.log, err);
        return cb(err);
      });
    },
    addNew: function (cb) {
      cashService.transferCash({db: param.db, log: param.log, from: data.accounts.from,
        to: data.accounts.to, amount: data.amount, seq: data.seq}, function (err) {
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// setp 2: copy transaction data from input to transaction record.
const copyTransData = function (next) {
  trans.category = {id: 0, name: ' ~ '};
  if(data.category) {
    trans.category.id = data.category.id;
    trans.category.name = data.category.name;
  }
  trans.bill = null;
  if(data.bill) {
    trans.bill = {
      id: data.bill.id,
      name: data.bill.name,
      account: {id: data.accounts.from.id, name: data.accounts.from.name}
    };
  }
  trans.description = sugar.String(data.description).capitalize(false, true).raw;
  trans.amount = numeral(data.amount).value();
  if(trans.transDt !== data.transDt) {
    trans.transDt = moment(data.transDt, fmt.DDMMMYYYY).format(fmt.YYYYMMDD);
    trans.transMonth = moment(data.transDt, fmt.DDMMMYYYY).date(1).format(fmt.YYYYMMDD);
  }
  trans.adhoc = data.adhoc;
  trans.adjust = data.adjust;
  trans.tallied = false;
  trans.tallyDt = null;
  // retain the old balanceBf/balanceAf amounts hpoing no finImpact..
  // if finImpact, these will be revised by the next method...
  if(data.accounts.from.id) {
    trans.accounts.from = {
      id: data.accounts.from.id,
      name: data.accounts.from.name,
      balanceBf: trans.accounts.from.balanceBf,
      balanceAf: trans.accounts.from.balanceAf};
  } else {
    trans.accounts.from = {id: 0, name: '', balanceBf: 0, balanceAf: 0};
  }
  if(data.accounts.to.id) {
    trans.accounts.to = {
      id: data.accounts.to.id,
      name: data.accounts.to.name,
      balanceBf: trans.accounts.to.balanceBf,
      balanceAf: trans.accounts.to.balanceAf};
  } else {
    trans.accounts.to = {id: 0, name: '', balanceBf: 0, balanceAf: 0};
  }
  return next();
};

const calcTransAcctBal = function (next) {
  if(!finImpact) {
    return next();
  }
  async.parallel({
    from: function (cb) {
      if(!trans.accounts.from.id) {
        return cb();
      }
      getPrevTrans(trans.cityId, trans.accounts.from.id, trans.seq, function (err, prev) {
        if(err) {
          logErr(param.log, err);
          return cb(err);
        }
        if(trans.accounts.from.id === prev.accounts.from.id) {
          trans.accounts.from.balanceBf = prev.accounts.from.balanceAf;
        } else if(trans.accounts.from.id === prev.accounts.to.id) {
          trans.accounts.from.balanceBf = prev.accounts.to.balanceAf;
        }
        const amt = data.accounts.from.cash ? trans.amount : trans.amount * -1;

        trans.accounts.from.balanceAf = trans.accounts.from.balanceBf - amt;
        return cb();
      });
    },
    to: function (cb) {
      if(!trans.accounts.to.id) {
        return cb();
      }
      getPrevTrans(trans.cityId, trans.accounts.to.id, trans.seq, function (err, prev) {
        if(err) {
          logErr(param.log, err);
          return cb(err);
        }
        if(trans.accounts.to.id === prev.accounts.from.id) {
          trans.accounts.to.balanceBf = prev.accounts.from.balanceAf;
        } else if(trans.accounts.to.id === prev.accounts.to.id) {
          trans.accounts.to.balanceBf = prev.accounts.to.balanceAf;
        }
        const amt = data.accounts.to.cash ? trans.amount : trans.amount * -1;

        trans.accounts.to.balanceAf = trans.accounts.to.balanceBf + amt;
        return cb();
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

const getPrevTrans = function (cityId, acctId, seq, next) {
  transactions.findPrevious(param.db, cityId, acctId, seq).then((doc) => {
    return next(null, doc);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 6: delete transaction record from DB
const saveTransaction = function (next) {
  transactions.updateTrans(param.db, trans).then(() => {
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
  modifyExpense: modifyExpense,
};
