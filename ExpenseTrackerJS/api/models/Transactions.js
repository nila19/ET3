/* eslint no-magic-numbers: "off", no-console: "off" */

'use strict';

const moment = require('moment');
const numeral = require('numeral');

const config = require('../config/config');
const fmt = require('../config/formats');
const model = require('./Model');

const schema = {
  id: 'int not-null primarykey autoincrement',
  cityId: 'int not-null',
  entryDt: 'timestamp',
  entryMonth: 'date',
  category: {id: 'int', name: 'string'},
  description: 'string not-null',
  amount: 'float',
  transDt: 'date',
  transMonth: 'date',
  seq: 'int',
  accounts: {
    from: {
      id: 'int',
      name: 'string',
      balanceBf: 'float default-0',
      balanceAf: 'float default-0',
    },
    to: {
      id: 'int',
      name: 'string',
      balanceBf: 'float default-0',
      balanceAf: 'float default-0',
    }
  },
  bill: {
    id: 'int',
    name: 'string',
    account: {id: 'int', name: 'string'}},
  adhoc: 'boolean',
  adjust: 'boolean',
  status: 'boolean',
  tallied: 'boolean',
  tallyDt: 'timestamp',
  FLAGS: {}
};

const searchUI = {
  cityId: 'int',
  acctId: 'int',
  billId: 'int',
  catId: 'int',
  description: 'string',
  amount: 'float',
  adhoc: 'string default-N',
  adjust: 'string default-N',
  entryMonth: 'date',
  entryYear: 'boolean',
  transMonth: 'date',
  transYear: 'boolean',
  thinList: 'boolean',
};

const Transactions = function () {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Transactions.prototype = model('transactions');
Transactions.prototype.findForCity = function (db, cityId) {
  return this.find(db, {cityId: cityId}, {fields: {_id: 0}, sort: {seq: -1}});
};
Transactions.prototype.findForAcct = function (db, cityId, acctId, billId) {
  const filter = {
    cityId: cityId,
  };

  if(billId) {
    filter['bill.id'] = billId;
  } else {
    filter.$or = [{'accounts.from.id': acctId}, {'accounts.to.id': acctId}];
  }
  return this.find(db, filter, {fields: {_id: 0}, sort: {seq: -1}});
};
Transactions.prototype.findPrevious = function (db, cityId, acctId, seq) {
  const filter = {
    cityId: cityId,
    seq: {$lt: seq}
  };

  filter.$or = [{'accounts.from.id': acctId}, {'accounts.to.id': acctId}];
  return this.findOne(db, filter, {fields: {_id: 0}, sort: {seq: -1}});
};
Transactions.prototype.findForSearch = function (db, search) {
  // dummy usage
  searchUI.acctId;

  const options = {fields: {_id: 0}, sort: {seq: -1}};
  let filter = {
    cityId: numeral(search.cityId).value(),
  };

  filter = this.buildSearchQueryOne(search, filter);
  filter = this.buildSearchQueryTwo(search, filter);

  // thin list
  if(search.thinList == 'true') {
    options.limit = config.thinList;
  }
  return this.find(db, filter, options);
};
Transactions.prototype.buildSearchQueryOne = function (search, filter) {
  // account id
  if(search.acctId) {
    filter.$or = [{'accounts.from.id': numeral(search.acctId).value()},
    {'accounts.to.id': numeral(search.acctId).value()}];
  }
  // bill id
  if(search.billId) {
    filter['bill.id'] = numeral(search.billId).value();
  }
  // category id
  if(search.catId) {
    filter['category.id'] = numeral(search.catId).value();
  }
  // description
  if(search.description) {
    filter.description = {$regex: new RegExp(search.description, 'gi')};
  }
  // amount
  if(search.amount) {
    const amt75 = numeral(search.amount).multiply(config.pct75).value();
    const amt125 = numeral(search.amount).multiply(config.pct125).value();

    filter.$and = [{amount: {$gt: amt75}}, {amount: {$lt: amt125}}];
  }
  // adhoc ind
  if(search.adhoc) {
    filter.adhoc = search.adhoc === 'Y';
  }
  // adjust ind
  if(search.adjust) {
    filter.adjust = search.adjust === 'Y';
  }
  return filter;
};
Transactions.prototype.buildSearchQueryTwo = function (search, filter) {
  // entry month
  if(search.entryMonth) {
    const entry = moment(search.entryMonth);

    if(search.entryYear == 'true') {
      // set startDt as 31-Dec of previous year, since that it is > than.
      // set endDt as 1-Jan of next year, since that it is > than.
      const yearBegin = entry.clone().month(0).date(0).format(fmt.YYYYMMDD);
      const yearEnd = entry.clone().month(11).date(31).format(fmt.YYYYMMDD);

      filter.$and = [{entryMonth: {$gt: yearBegin}}, {entryMonth: {$lt: yearEnd}}];
    } else {
      filter.entryMonth = entry.format(fmt.YYYYMMDD);
    }
  }
  // trans month
  if(search.transMonth) {
    const trans = moment(search.transMonth);

    if(search.transYear == 'true') {
      // set startDt as 31-Dec of previous year, since that it is > than.
      const yearBegin = trans.clone().month(0).date(0).format(fmt.YYYYMMDD);
      const yearEnd = trans.clone().month(11).date(31).format(fmt.YYYYMMDD);

      filter.$and = [{transMonth: {$gt: yearBegin}}, {transMonth: {$lt: yearEnd}}];
    } else {
      filter.transMonth = trans.format(fmt.YYYYMMDD);
    }
  }
  return filter;
};

Transactions.prototype.findForMonthlySummary = function (db, cityId, regular, adhoc) {
  const filter = {
    cityId: cityId,
    adjust: false,
  };

  if(!(regular && adhoc)) {
    filter.adhoc = (regular && !adhoc) ? false : true;
  }
  return this.find(db, filter, {fields: {_id: 0}, sort: {seq: -1}});
};
// get Transactions for the last 3 months excluding the current month.
Transactions.prototype.findForForecast = function (db, cityId) {
  const thisMth = moment().date(1);
  const beginMth = thisMth.clone().subtract(4, 'months').format(fmt.YYYYMMDD);
  const endMth = thisMth.clone().subtract(1, 'months').format(fmt.YYYYMMDD);
  const filter = {
    cityId: cityId,
    adhoc: false,
    adjust: false,
    transMonth: {$gt: beginMth, $lte: endMth}
  };

  return this.find(db, filter, {fields: {_id: 0}, sort: {seq: -1}});
};
Transactions.prototype.findAllEntryMonths = function (db, cityId) {
  return this.distinct(db, 'entryMonth', {cityId: cityId}, {fields: {_id: 0}, sort: {entryMonth: -1}});
};
Transactions.prototype.findAllTransMonths = function (db, cityId) {
  return this.distinct(db, 'transMonth', {cityId: cityId}, {fields: {_id: 0}, sort: {transMonth: -1}});
};
Transactions.prototype.findAllDescriptions = function (db, cityId) {
  return db.get(this.collection).aggregate([{$match: {cityId: cityId}},
    {$group: {_id: '$description', count: {$sum: 1}}}, {$sort: {count: -1}}]);
};
Transactions.prototype.updateTrans = function (db, trans) {
  const filter = {
    cityId: trans.cityId,
    id: trans.id
  };

  const mod = {
    $set: {
      category: trans.category,
      description: trans.description,
      amount: trans.amount,
      transDt: trans.transDt,
      transMonth: trans.transMonth,
      adhoc: trans.adhoc,
      adjust: trans.adjust,
      tallied: trans.tallied,
      tallyDt: trans.tallyDt,
      accounts: trans.accounts
    }
  };

  if(trans.bill) {
    mod.$set.bill = trans.bill;
  } else {
    mod.$unset = {bill: ''};
  }

  return this.update(db, filter, mod);
};

module.exports = function () {
  return new Transactions();
};
