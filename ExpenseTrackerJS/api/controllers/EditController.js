// TODO Fix this..
/* eslint no-unused-vars: "off" */
'use strict';

const addservice = require('../services/AddService');
const error = 1000;
let parms = null;

const addExpense = function (req, resp) {
  parms = {
    db: req.app.locals.db,
    log: req.app.locals.log
  };
  // check if city is editable.
  addservice.addExpense(parms, req.body, function (err) {
    if(err) {
      parms.log.error(err);
      return resp.json({code: error});
    } else {
      return resp.json({code: 0, msg: 'Expense created successfully!!!'});
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
  addExpense: addExpense,
  modifyExpense: modifyExpense,
  deleteExpense: deleteExpense,
  swapExpenses: swapExpenses,
  payBill: payBill,
};
