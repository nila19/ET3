// TODO Fix this..
/* eslint no-unused-vars: "off" */
'use strict';

const moment = require('moment');
const addservice = require('../services/AddService');
const tallyservice = require('../services/TallyService');
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
  // check if city is editable.
};

const swapExpenses = function (req, resp, cityId) {
  // check if city is editable.
};

const payBill = function (req, resp) {
  // check if city is editable.
};

module.exports = {
  tallyAccount: tallyAccount,
  addExpense: addExpense,
  modifyExpense: modifyExpense,
  deleteExpense: deleteExpense,
  swapExpenses: swapExpenses,
  payBill: payBill,
};
