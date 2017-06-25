/* eslint no-magic-numbers: "off" */

'use strict';
const moment = require('moment');
const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

const {expect} = chai;
const mongo = require('../../../api/config/mongodb-config.js');

const accounts = require('../../../api/models/Accounts.js')();
const bills = require('../../../api/models/Bills.js')();
const transactions = require('../../../api/models/Transactions.js')();

const deleteservice = require('../../../api/services/DeleteService.js');
const billpayservice = require('../../../api/services/BillPayService.js');

describe('models.billpayservice', function () {
  let db = null;

  before('get db connection', function (done) {
    mongo.ping(null, (errr, db1) => {
      db = db1;
      done();
    });
  });
  describe('payBill', function () {
    // case #0
    describe('pay bill with an inactive city', function () {
      const form = {
        city: {id: 20090201},
        bill: {id: 99, balance: 476.87, account: {id: 60, balance: 0}},
        account: {id: 62, balance: 0},
        paidAmt: 50.25,
        paidDt: '15-May-2017',
      };
      let transId = 0;

      before('fetch account balance', function (done) {
        accounts.findById(db, form.bill.account.id).then((ac) => {
          form.bill.account.balance = ac.balance;
          accounts.findById(db, form.account.id).then((ac) => {
            form.account.balance = ac.balance;
            done();
          });
        });
      });
      it('should throw an error for pay bill with inactive city', function (done) {
        billpayservice.payBill({db: db, log: {error: () => {}}}, form, (err, t) => {
          if (err) {
            expect(err.message).to.equal('City is not active.');
          } else {
            transId = t.id;
            expect.fail('ok', 'error', 'Exception not thrown in the pay bill with inactive city');
          }
          done();
        });
      });
      after('delete the added expense', function (done) {
        if (!transId) {
          done();
        } else {
          deleteservice.deleteExpense({db: db, log: console, transId: transId}, () => {
            accounts.findById(db, form.account.id).then((ac) => {
              expect(ac).to.have.property('balance', form.account.balance);
              accounts.findById(db, form.bill.account.id).then((ac) => {
                expect(ac).to.have.property('balance', form.bill.account.balance);
                const mod = {$inc: {balance: form.paidAmt}, $pull: {payments: {id: transId}}};

                bills.update(db, {id: form.bill.id}, mod).then(() => {
                  bills.findById(db, form.bill.id).then((bill) => {
                    expect(bill).to.have.property('balance', form.bill.balance);
                    done();
                  });
                });
              });
            });
          });
        }
      });
    });
    // case #1
    describe('make partial payment', function () {
      const form = {
        city: {id: 20140301},
        bill: {id: 99, balance: 476.87, account: {id: 60, balance: 0}},
        account: {id: 62, balance: 0},
        paidAmt: 50.25,
        paidDt: '15-May-2017',
      };
      let transId = 0;
      const entryMth = moment().startOf('month').format('YYYY-MM-DD');

      before('fetch account balance', function (done) {
        accounts.findById(db, form.bill.account.id).then((ac) => {
          form.bill.account.balance = ac.balance;
          accounts.findById(db, form.account.id).then((ac) => {
            form.account.balance = ac.balance;
            done();
          });
        });
      });
      it('should make partial payment', function (done) {
        billpayservice.payBill({db: db, log: console}, form, (errr, t) => {
          transId = t.id;
          transactions.findById(db, transId).then((tr) => {
            expect(tr).to.have.property('id', transId);
            expect(tr).to.have.property('cityId', 20140301);
            expect(tr).to.have.property('entryMonth', entryMth);
            expect(tr.category).to.have.property('id', 0);
            expect(tr).to.have.property('description', 'CC Bill Payment');
            expect(tr).to.have.property('amount', form.paidAmt);
            expect(tr).to.have.property('transDt', '2017-05-15');
            expect(tr).to.have.property('transMonth', '2017-05-01');
            expect(tr).to.have.property('seq', transId);
            expect(tr.accounts.from).to.have.property('id', form.account.id);
            expect(tr.accounts.from).to.have.property('balanceBf', form.account.balance);
            expect(tr.accounts.from).to.have.property('balanceAf', form.account.balance - form.paidAmt);
            expect(tr.accounts.to).to.have.property('id', form.bill.account.id);
            expect(tr.accounts.to).to.have.property('balanceBf', form.bill.account.balance);
            expect(tr.accounts.to).to.have.property('balanceAf', form.bill.account.balance - form.paidAmt);
            expect(tr).to.have.property('adjust', true);
            expect(tr).to.have.property('adhoc', false);
            expect(tr).to.have.property('status', true);
            expect(tr).to.have.property('tallied', false);
            expect(tr).to.have.property('tallyDt', null);
            bills.findById(db, form.bill.id).then((bill) => {
              expect(bill).to.have.property('balance', form.bill.balance - form.paidAmt);
              expect(bill.payments.find((p) => p.id === transId)).to.have.property('amount', form.paidAmt);
              accounts.findById(db, form.bill.account.id).then((ac) => {
                expect(ac).to.have.property('balance', form.bill.account.balance - form.paidAmt);
                accounts.findById(db, form.account.id).then((ac) => {
                  expect(ac).to.have.property('balance', form.account.balance - form.paidAmt);
                  done();
                });
              });
            });
          });
        });
      });
      after('delete the added expense', function (done) {
        deleteservice.deleteExpense({db: db, log: console, transId: transId}, () => {
          accounts.findById(db, form.account.id).then((ac) => {
            expect(ac).to.have.property('balance', form.account.balance);
            accounts.findById(db, form.bill.account.id).then((ac) => {
              expect(ac).to.have.property('balance', form.bill.account.balance);
              const mod = {$inc: {balance: form.paidAmt}, $pull: {payments: {id: transId}}};

              bills.update(db, {id: form.bill.id}, mod).then(() => {
                bills.findById(db, form.bill.id).then((bill) => {
                  expect(bill).to.have.property('balance', form.bill.balance);
                  done();
                });
              });
            });
          });
        });
      });
    });
    // case #2
    describe('make full payment', function () {
      const form = {
        city: {id: 20140301},
        bill: {id: 99, balance: 476.87, account: {id: 60, balance: 0}},
        account: {id: 62, balance: 0},
        paidAmt: 476.87,
        paidDt: '15-May-2017',
      };
      let transId = 0;
      const entryMth = moment().startOf('month').format('YYYY-MM-DD');

      before('fetch account balance', function (done) {
        accounts.findById(db, form.bill.account.id).then((ac) => {
          form.bill.account.balance = ac.balance;
          accounts.findById(db, form.account.id).then((ac) => {
            form.account.balance = ac.balance;
            done();
          });
        });
      });
      it('should make full payment', function (done) {
        billpayservice.payBill({db: db, log: console}, form, (errr, t) => {
          transId = t.id;
          transactions.findById(db, transId).then((tr) => {
            expect(tr).to.have.property('id', transId);
            expect(tr).to.have.property('cityId', 20140301);
            expect(tr).to.have.property('entryMonth', entryMth);
            expect(tr.category).to.have.property('id', 0);
            expect(tr).to.have.property('description', 'CC Bill Payment');
            expect(tr).to.have.property('amount', form.paidAmt);
            expect(tr).to.have.property('transDt', '2017-05-15');
            expect(tr).to.have.property('transMonth', '2017-05-01');
            expect(tr).to.have.property('seq', transId);
            expect(tr.accounts.from).to.have.property('id', form.account.id);
            expect(tr.accounts.from).to.have.property('balanceBf', form.account.balance);
            expect(tr.accounts.from).to.have.property('balanceAf', form.account.balance - form.paidAmt);
            expect(tr.accounts.to).to.have.property('id', form.bill.account.id);
            expect(tr.accounts.to).to.have.property('balanceBf', form.bill.account.balance);
            expect(tr.accounts.to).to.have.property('balanceAf', form.bill.account.balance - form.paidAmt);
            expect(tr).to.have.property('adjust', true);
            expect(tr).to.have.property('adhoc', false);
            expect(tr).to.have.property('status', true);
            expect(tr).to.have.property('tallied', false);
            expect(tr).to.have.property('tallyDt', null);
            bills.findById(db, form.bill.id).then((bill) => {
              expect(bill).to.have.property('balance', 0);
              expect(bill.payments.find((p) => p.id === transId)).to.have.property('amount', form.paidAmt);
              accounts.findById(db, form.bill.account.id).then((ac) => {
                expect(ac).to.have.property('balance', form.bill.account.balance - form.paidAmt);
                accounts.findById(db, form.account.id).then((ac) => {
                  expect(ac).to.have.property('balance', form.account.balance - form.paidAmt);
                  done();
                });
              });
            });
          });
        });
      });
      after('delete the added expense', function (done) {
        deleteservice.deleteExpense({db: db, log: console, transId: transId}, () => {
          accounts.findById(db, form.account.id).then((ac) => {
            expect(ac).to.have.property('balance', form.account.balance);
            accounts.findById(db, form.bill.account.id).then((ac) => {
              expect(ac).to.have.property('balance', form.bill.account.balance);
              const mod = {$inc: {balance: form.paidAmt}, $pull: {payments: {id: transId}}};

              bills.update(db, {id: form.bill.id}, mod).then(() => {
                bills.findById(db, form.bill.id).then((bill) => {
                  expect(bill).to.have.property('balance', form.bill.balance);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
  after('close db connection', function () {
    // do nothing.
  });
});
