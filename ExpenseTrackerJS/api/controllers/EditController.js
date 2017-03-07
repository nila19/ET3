'use strict';

const moment = require('moment');
const tallyservice = require('../services/TallyService');
const addservice = require('../services/AddService');
const deleteservice = require('../services/DeleteService');
const billpayservice = require('../services/BillPayService');
const error = 1000;

const tallyAccount = function (req, resp, acctId) {
  const param = {
    db: req.app.locals.db,
    log: req.app.locals.log,
    acctId: acctId,
    now: moment().valueOf()
  };

  tallyservice.tally(param, function (err) {
    if(err) {
      param.log.error(err);
      return resp.json({code: error});
    } else {
      return resp.json({code: 0, message: 'Account tallied successfully!!'});
    }
  });
};

const addExpense = function (req, resp) {
  const param = {
    db: req.app.locals.db,
    log: req.app.locals.log
  };

  addservice.addExpense(param, req.body, function (err, trans) {
    if(err) {
      param.log.error(err);
      return resp.json({code: error});
    } else {
      return resp.json({code: 0, data: trans});
    }
  });
};

const modifyExpense = function (req, resp) {
  // check if city is editable.
};

const deleteExpense = function (req, resp, transId) {
  const param = {
    db: req.app.locals.db,
    log: req.app.locals.log,
    transId: transId
  };

  deleteservice.deleteExpense(param, function (err) {
    if(err) {
      param.log.error(err);
      return resp.json({code: error});
    } else {
      return resp.json({code: 0});
    }
  });
};

const swapExpenses = function (req, resp, cityId) {
  // check if city is editable.
};

const payBill = function (req, resp) {
  const param = {
    db: req.app.locals.db,
    log: req.app.locals.log
  };

  billpayservice.payBill(param, req.body, function (err, trans) {
    if(err) {
      param.log.error(err);
      return resp.json({code: error});
    } else {
      return resp.json({code: 0, data: trans});
    }
  });
};

module.exports = {
  tallyAccount: tallyAccount,
  addExpense: addExpense,
  modifyExpense: modifyExpense,
  deleteExpense: deleteExpense,
  swapExpenses: swapExpenses,
  payBill: payBill,
};
