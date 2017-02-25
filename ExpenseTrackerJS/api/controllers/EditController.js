// TODO Fix this..
/* eslint no-unused-vars: "off" */
'use strict';

const accounts = require('../models/Accounts')();
const bills = require('../models/Bills')();
const transactions = require('../models/Transactions');
const error = 1000;

const tallyAccount = function (req, resp, acctId) {
  // check if city is editable.
};

const addExpense = function (req, resp) {
  // check if city is editable.
};

const modifyExpense = function (req, resp) {
  // check if city is editable.
};

const deleteExpense = function (req, resp) {
  // check if city is editable.
};

const swapExpenses = function (req, resp) {
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
