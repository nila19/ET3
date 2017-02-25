
'use strict';

const moment = require('moment');
const number = require('numeral');

const config = require('../config/config');
const model = require('./Model');

const schema = {
  transId: 'int not-null primarykey autoincrement',
  cityId: 'int not-null',
  entryDt: 'timestamp',
  entryMonth: 'date',
  catId: 'int',
  description: 'string not-null',
  amount: 'float',
  transDt: 'date',
  transMonth: 'date',
  seq: 'int',
  accounts: {
    from: {
      acctId: 'int',
      billId: 'int',
      balanceBf: 'float default-0',
      balanceAf: 'float default-0',
    },
    to: {
      acctId: 'int',
      billId: 'int',
      balanceBf: 'float default-0',
      balanceAf: 'float default-0',
    }
  },
  adhoc: 'string default-N',
  adjust: 'string default-N',
  status: 'string default-P',
  tallied: 'string default-N',
  tallyDt: 'timestamp',
  FLAGS: {
    adhoc: {YES: 'Y', NO: 'N'},
    adjust: {YES: 'Y', NO: 'N'},
    status: {OPEN: 'O', POSTED: 'P'},
    tallied: {YES: 'Y', NO: 'N'},
  }
};

const searchUI = {
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

const Transactions = function Transactions() {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Transactions.prototype = model('transactions');
Transactions.prototype.findForCity = function findForCity(db, cityId) {
  return this.find(db, {cityId: cityId}, {sort: {seq: -1}});
};
// TODO Unused ??
Transactions.prototype.findForAcct = function findForAcct(db, cityId, acctId, billId) {
  const filter = {
    cityId: cityId,
    tallied: this.FLAGS.tallied.NO,
  };

  if(billId) {
    filter.$or = [{'accounts.from.billId': billId}, {'accounts.to.billId': billId}];
  } else {
    filter.$or = [{'accounts.from.acctId': acctId}, {'accounts.to.acctId': acctId}];
  }
  return this.find(db, filter, {sort: {seq: -1}});
};
Transactions.prototype.findForSearch = function findForSearch(db, search) {
  // dummy usage
  searchUI.acctId;

  const options = {sort: {seq: -1}};
  let filter = {
    cityId: search.cityId,
  };

  filter = this.buildSearchQueryOne(search, filter);
  filter = this.buildSearchQueryTwo(search, filter);

  // thin list
  if(search.thinList) {
    options.limit = config.thinList;
  }
  // console.log(JSON.stringify(filter));
  return this.find(db, filter, options);
};
Transactions.prototype.buildSearchQueryOne = function buildSearchQueryOne(search, filter) {
  // account id
  if(search.acctId) {
    filter.$or = [{'accounts.from.acctId': search.acctId}, {'accounts.to.acctId': search.acctId}];
  }
  // bill id
  if(search.billId) {
    filter['accounts.from.billId'] = search.billId;
  }
  // category id
  if(search.catId) {
    filter.catId = search.catId;
  }
  // description
  if(search.description) {
    filter.description = {$regex: new RegExp(search.description, 'gi')};
  }
  // amount
  if(search.amount) {
    const amt75 = number(search.amount).multiply(config.pct75).value();
    const amt125 = number(search.amount).multiply(config.pct125).value();

    filter.$and = [{amount: {$gt: amt75}}, {amount: {$lt: amt125}}];
  }
  // adhoc ind
  if(search.adhoc) {
    filter.adhoc = search.adhoc;
  }
  // adjust ind
  if(search.adjust) {
    filter.adjust = search.adjust;
  }
  return filter;
};
Transactions.prototype.buildSearchQueryTwo = function buildSearchQueryTwo(search, filter) {
  // entry month
  if(search.entryMonth) {
    if(search.entryYear) {
      // set startDt as 31-Dec of previous year, since that it is > than.
      const yearBegin = moment(search.entryMonth).month(0).date(0).valueOf();
      const yearEnd = moment(search.entryMonth).month(11).date(31).valueOf();

      filter.$and = [{entryMonth: {$gt: yearBegin}}, {entryMonth: {$lt: yearEnd}}];
    } else {
      filter.entryMonth = search.entryMonth;
    }
  }
  // trans month
  if(search.transMonth) {
    if(search.transYear) {
      // set startDt as 31-Dec of previous year, since that it is > than.
      const yearBegin = moment(search.transMonth).month(0).date(0).valueOf();
      const yearEnd = moment(search.transMonth).month(11).date(31).valueOf();

      filter.$and = [{transMonth: {$gt: yearBegin}}, {transMonth: {$lt: yearEnd}}];
    } else {
      filter.transMonth = search.transMonth;
    }
  }
  return filter;
};

Transactions.prototype.findForMonthlySummary = function findForMonthlySummary(db, cityId, regular, adhoc) {
  const filter = {
    cityId: cityId,
    adjust: this.FLAGS.adjust.NO,
  };

  if(!(regular && adhoc)) {
    filter.adhoc = (regular && !adhoc) ? this.FLAGS.adhoc.NO : ((adhoc && !regular) ? this.FLAGS.adhoc.YES : ' ');
  }
  return this.find(db, filter, {sort: {seq: -1}});
};
// get Transactions for the last 3 months excluding the current month.
Transactions.prototype.findForForecast = function findForForecast(db, cityId) {
  const thisMth = moment().date(1);
  const beginMth = thisMth.clone().subtract(4, 'months').valueOf();
  const endMth = thisMth.clone().subtract(1, 'months').valueOf();
  const filter = {
    cityId: cityId,
    adhoc: this.FLAGS.adhoc.NO,
    adjust: this.FLAGS.adjust.NO,
    transMonth: {$gt: beginMth, $lte: endMth}
  };

  return this.find(db, filter, {sort: {seq: -1}});
};
Transactions.prototype.findAllEntryMonths = function findAllEntryMonths(db, cityId) {
  return this.distinct(db, 'entryMonth', {cityId: cityId}, {sort: {entryMonth: -1}});
};
Transactions.prototype.findAllTransMonths = function findAllTransMonths(db, cityId) {
  return this.distinct(db, 'transMonth', {cityId: cityId}, {sort: {transMonth: -1}});
};
Transactions.prototype.findAllDescriptions = function findAllDescriptions(db, cityId) {
  return db.get(this.collection).aggregate([{$match: {cityId: cityId}},
    {$group: {_id: '$description', count: {$sum: 1}}}, {$sort: {count: -1}}]);
};

module.exports = function exp() {
  return new Transactions();
};
