/* global sinon, inject, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('edit.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute loadBills', function () {
    let editService = null;
    let ajaxService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_editService_, _ajaxService_) {
        editService = _editService_;
        ajaxService = _ajaxService_;
      });
    });
    it('should loadBills - no account, OPEN', function () {
      sinon.spy(ajaxService, 'query');

      editService.data.expense.accounts = {from: {id: 60}};
      editService.loadBills();

      expect(ajaxService.query.calledOnce).to.be.true;
      expect(ajaxService.query.calledWith('/dashboard/bills', {acctId: 60})).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.query.restore();
    });
  });
  // case #1
  describe('Execute loadBills - make ajax call', function () {
    let $httpBackend = null;
    let editService = null;
    let values = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_editService_, _VALUES_) {
        editService = _editService_;
        values = _VALUES_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.expectGET('./dashboard/bills?acctId=60');
      $httpBackend.when('GET', './dashboard/bills?acctId=60').respond({code: 0, data: [{id: 100, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-03-01T13:10:01-06:00', billDt: '2017-03-22', dueDt: '2017-04-19', closed: true, amount: 203.26, balance: 123.14, payments: [{id: 8571, transDt: '2017-04-12', amount: 50}, {id: 8572, transDt: '2017-04-13', amount: 10}, {id: 8947, transDt: '2017-06-05', amount: 20.12}], name: 'Chase Freedom : 2017-03-22 #100', $$hashKey: 'object:339'}, {id: 85, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2016-11-28T08:12:02-06:00', billDt: '2016-12-24', dueDt: '2017-01-21', closed: true, amount: 2301.82, balance: 43.28, payments: [{id: 8430, transDt: '2017-01-19', amount: 2258.54}], name: 'BOA Visa : 2016-12-24 #85'}]});
    }));
    it('should execute loadBills, call ajax & load data.', function () {
      editService.data.expense.accounts = {from: {id: 60}};
      values.data.bills = [];
      editService.loadBills();
      $httpBackend.flush();

      expect(values.data.bills).to.be.not.empty;
      expect(values.data.bills.length).to.equal(2);
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
  // case #2
  describe('Execute loadData', function () {
    let editService = null;
    let ajaxService = null;
    let values = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_editService_, _ajaxService_, _VALUES_) {
        editService = _editService_;
        ajaxService = _ajaxService_;
        values = _VALUES_;
      });
    });
    it('should loadData - no bills', function () {
      sinon.spy(ajaxService, 'query');
      const tr = {id: 8441, cityId: 20140301, entryDt: '2017-06-17T18:50:49-05:00', entryMonth: '2017-06-01', category: {id: 0, name: null}, description: 'ATM Cash', amount: 80, transDt: '2017-01-25', transMonth: '2017-01-01', seq: 8897, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 21879.93, balanceAf: 21799.93}, to: {id: 63, name: 'Cash - Bala', balanceBf: 4.719999999999999, balanceAf: 84.72}}, adhoc: false, adjust: true, status: true, tallied: false, tallyDt: null};

      values.data.accounts = [{id: 62, cityId: 20140301, name: 'BOA - 7787', balance: 11399.68, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 1, tallyBalance: 15807.95, tallyDt: '2017-03-13T09:56:03-05:00', closingDay: 0, dueDay: 0, bills: null}, {id: 80, cityId: 20140301, name: 'Chase Checking', balance: 4022.95, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 2, tallyBalance: 4043.0699999999997, tallyDt: '2017-04-11T21:24:22-05:00', closingDay: 0, dueDay: 0, bills: null}, {id: 60, cityId: 20140301, name: 'BOA Visa', balance: 2011.8600000000001, cash: false, active: true, billed: true, icon: 'credit_card', color: 'red', seq: 3, tallyBalance: 2001.8600000000001, tallyDt: '2017-06-22T00:11:27-05:00', closingDay: 24, dueDay: 21, bills: {last: {id: 107, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-24', dueDt: '2017-05-21', closed: true, amount: 0, balance: 0, name: 'BOA Visa : 2017-04-24 #107'}, open: {id: 108, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2017-06-11T17:59:16-05:00', billDt: '2017-06-24', dueDt: '2017-07-21', closed: false, amount: 17.50999999999999, balance: 17.50999999999999, name: 'BOA Visa : 2017-06-24 #108'}}}, {id: 83, cityId: 20140301, name: 'Chase Freedom', balance: -881.86, cash: false, active: true, billed: true, icon: 'credit_card', color: 'red', seq: 5, tallyBalance: 198.06, tallyDt: '2017-04-11T12:29:18-05:00', closingDay: 22, dueDay: 19, bills: {last: {id: 104, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-22', dueDt: '2017-05-19', closed: true, amount: 0, balance: 0, name: 'Chase Freedom : 2017-04-22 #104'}, open: {id: 109, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-06-11T17:59:16-05:00', billDt: '2017-06-22', dueDt: '2017-07-19', closed: false, amount: 0, balance: 0, name: 'Chase Freedom : 2017-06-22 #109'}}}, {id: 75, cityId: 20140301, name: 'Blue Cash Amex', balance: 0, cash: false, active: true, billed: true, icon: 'credit_card', color: 'red', seq: 7, tallyBalance: 0, tallyDt: '2017-04-11T10:52:39-05:00', closingDay: 3, dueDay: 28, bills: {last: {id: 105, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-05-03', dueDt: '2017-05-28', closed: true, amount: 0, balance: 0, name: 'Blue Cash Amex : 2017-05-03 #105'}, open: {id: 110, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-06-11T17:59:16-05:00', billDt: '2017-07-03', dueDt: '2017-07-28', closed: false, amount: 0, balance: 0, name: 'Blue Cash Amex : 2017-07-03 #110'}}}, {id: 68, cityId: 20140301, name: 'GAP Visa', balance: 445.98, cash: false, active: true, billed: true, icon: 'credit_card', color: 'red', seq: 8, tallyBalance: 485.98, tallyDt: '2017-03-23T19:47:21-05:00', closingDay: 15, dueDay: 8, bills: {last: {id: 111, cityId: 20140301, account: {id: 68, name: 'GAP Visa'}, createdDt: '2017-06-11T17:59:16-05:00', billDt: '2017-06-15', dueDt: '2017-07-08', closed: true, amount: 0, balance: 0, name: 'GAP Visa : 2017-06-15 #111'}, open: {id: 112, cityId: 20140301, account: {id: 68, name: 'GAP Visa'}, createdDt: '2017-06-18T12:59:20-05:00', billDt: '2017-07-15', dueDt: '2017-08-08', closed: false, amount: 0, balance: 0, name: 'GAP Visa : 2017-07-15 #112'}}}, {id: 63, cityId: 20140301, name: 'Cash - Bala', balance: 84.72, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 20, tallyBalance: 84.72, tallyDt: '2017-03-08T09:37:17-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 64, cityId: 20140301, name: 'Cash - Anitha', balance: 30.39, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 21, tallyBalance: 30.39, tallyDt: '2017-01-29T21:29:04-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 73, cityId: 20140301, name: 'HSA', balance: 805.14, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 22, tallyBalance: 805.14, tallyDt: '2017-03-08T09:40:51-06:00', closingDay: 0, dueDay: 0, bills: null}];
      expect(editService.data.expense).to.be.empty;
      editService.loadData(tr);
      expect(editService.data.expense).to.be.not.empty;
      expect(editService.data.expense.accounts.from.billed).to.be.false;
      expect(ajaxService.query.calledOnce).to.be.false;
    });
    it('should loadData - bills', function () {
      sinon.spy(ajaxService, 'query');
      const tr = {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2011.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}};

      values.data.accounts = [{id: 62, cityId: 20140301, name: 'BOA - 7787', balance: 11399.68, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 1, tallyBalance: 15807.95, tallyDt: '2017-03-13T09:56:03-05:00', closingDay: 0, dueDay: 0, bills: null}, {id: 80, cityId: 20140301, name: 'Chase Checking', balance: 4022.95, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 2, tallyBalance: 4043.0699999999997, tallyDt: '2017-04-11T21:24:22-05:00', closingDay: 0, dueDay: 0, bills: null}, {id: 60, cityId: 20140301, name: 'BOA Visa', balance: 2011.8600000000001, cash: false, active: true, billed: true, icon: 'credit_card', color: 'red', seq: 3, tallyBalance: 2001.8600000000001, tallyDt: '2017-06-22T00:11:27-05:00', closingDay: 24, dueDay: 21, bills: {last: {id: 107, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-24', dueDt: '2017-05-21', closed: true, amount: 0, balance: 0, name: 'BOA Visa : 2017-04-24 #107'}, open: {id: 108, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2017-06-11T17:59:16-05:00', billDt: '2017-06-24', dueDt: '2017-07-21', closed: false, amount: 17.50999999999999, balance: 17.50999999999999, name: 'BOA Visa : 2017-06-24 #108'}}}, {id: 83, cityId: 20140301, name: 'Chase Freedom', balance: -881.86, cash: false, active: true, billed: true, icon: 'credit_card', color: 'red', seq: 5, tallyBalance: 198.06, tallyDt: '2017-04-11T12:29:18-05:00', closingDay: 22, dueDay: 19, bills: {last: {id: 104, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-22', dueDt: '2017-05-19', closed: true, amount: 0, balance: 0, name: 'Chase Freedom : 2017-04-22 #104'}, open: {id: 109, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-06-11T17:59:16-05:00', billDt: '2017-06-22', dueDt: '2017-07-19', closed: false, amount: 0, balance: 0, name: 'Chase Freedom : 2017-06-22 #109'}}}, {id: 75, cityId: 20140301, name: 'Blue Cash Amex', balance: 0, cash: false, active: true, billed: true, icon: 'credit_card', color: 'red', seq: 7, tallyBalance: 0, tallyDt: '2017-04-11T10:52:39-05:00', closingDay: 3, dueDay: 28, bills: {last: {id: 105, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-05-03', dueDt: '2017-05-28', closed: true, amount: 0, balance: 0, name: 'Blue Cash Amex : 2017-05-03 #105'}, open: {id: 110, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-06-11T17:59:16-05:00', billDt: '2017-07-03', dueDt: '2017-07-28', closed: false, amount: 0, balance: 0, name: 'Blue Cash Amex : 2017-07-03 #110'}}}, {id: 68, cityId: 20140301, name: 'GAP Visa', balance: 445.98, cash: false, active: true, billed: true, icon: 'credit_card', color: 'red', seq: 8, tallyBalance: 485.98, tallyDt: '2017-03-23T19:47:21-05:00', closingDay: 15, dueDay: 8, bills: {last: {id: 111, cityId: 20140301, account: {id: 68, name: 'GAP Visa'}, createdDt: '2017-06-11T17:59:16-05:00', billDt: '2017-06-15', dueDt: '2017-07-08', closed: true, amount: 0, balance: 0, name: 'GAP Visa : 2017-06-15 #111'}, open: {id: 112, cityId: 20140301, account: {id: 68, name: 'GAP Visa'}, createdDt: '2017-06-18T12:59:20-05:00', billDt: '2017-07-15', dueDt: '2017-08-08', closed: false, amount: 0, balance: 0, name: 'GAP Visa : 2017-07-15 #112'}}}, {id: 63, cityId: 20140301, name: 'Cash - Bala', balance: 84.72, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 20, tallyBalance: 84.72, tallyDt: '2017-03-08T09:37:17-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 64, cityId: 20140301, name: 'Cash - Anitha', balance: 30.39, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 21, tallyBalance: 30.39, tallyDt: '2017-01-29T21:29:04-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 73, cityId: 20140301, name: 'HSA', balance: 805.14, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 22, tallyBalance: 805.14, tallyDt: '2017-03-08T09:40:51-06:00', closingDay: 0, dueDay: 0, bills: null}];
      expect(editService.data.expense).to.be.empty;
      editService.loadData(tr);
      expect(editService.data.expense).to.be.not.empty;
      expect(editService.data.expense.accounts.from.billed).to.be.true;
      expect(ajaxService.query.calledOnce).to.be.true;
      expect(ajaxService.query.calledWith('/dashboard/bills', {acctId: 60})).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.query.restore();
    });
  });
  // case #3
  describe('Execute deleteExpense, modifyExpense', function () {
    let editService = null;
    let ajaxService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_editService_, _ajaxService_) {
        editService = _editService_;
        ajaxService = _ajaxService_;
      });
    });
    it('should execute deleteExpense', function () {
      sinon.spy(ajaxService, 'post');
      expect(editService.data.loading).to.be.false;
      editService.data.expense = {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2011.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}};
      editService.deleteExpense();

      expect(editService.data.loading).to.be.true;
      expect(ajaxService.post.calledOnce).to.be.true;
      expect(ajaxService.post.calledWith('/edit/delete/8946')).to.be.true;
    });
    it('should execute modifyExpense', function () {
      sinon.spy(ajaxService, 'post');
      expect(editService.data.loading).to.be.false;
      editService.data.expense = {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2011.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}};
      editService.modifyExpense();

      expect(editService.data.loading).to.be.true;
      expect(ajaxService.post.calledOnce).to.be.true;
      expect(ajaxService.post.calledWith('/edit/modify', editService.data.expense)).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.post.restore();
    });
  });
  // case #4
  describe('Execute deleteExpense, modifyExpense - make ajax calls', function () {
    let $httpBackend = null;
    let editService = null;
    let explistwrapperService = null;
    let utilsService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_editService_, _explistwrapperService_, _utilsService_) {
        editService = _editService_;
        explistwrapperService = _explistwrapperService_;
        utilsService = _utilsService_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
    }));
    beforeEach('sinon spy', function () {
      sinon.stub(utilsService, 'showMsg');
      sinon.stub(explistwrapperService, 'deleteItem');
      sinon.stub(explistwrapperService, 'modifyItem');
    });
    it('should execute deleteExpense, call ajax & load data - Success', function () {
      $httpBackend.expectPOST('./edit/delete/8946');
      $httpBackend.when('POST', './edit/delete/8946').respond({code: 0});

      expect(editService.data.loading).to.be.false;
      editService.data.expense = {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2011.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}};
      editService.deleteExpense();
      expect(editService.data.loading).to.be.true;
      $httpBackend.flush();

      expect(editService.data.loading).to.be.false;
      expect(utilsService.showMsg.calledOnce).to.be.true;
      expect(utilsService.showMsg.calledWith('Delete Expense', 0)).to.be.true;
      expect(explistwrapperService.deleteItem.calledOnce).to.be.true;
      expect(explistwrapperService.deleteItem.calledWith(8946)).to.be.true;
    });
    it('should execute deleteExpense, call ajax & load data - Failure', function () {
      $httpBackend.expectPOST('./edit/delete/8946');
      $httpBackend.when('POST', './edit/delete/8946').respond({code: 100});

      expect(editService.data.loading).to.be.false;
      editService.data.expense = {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2011.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}};
      editService.deleteExpense();
      expect(editService.data.loading).to.be.true;
      $httpBackend.flush();

      expect(editService.data.loading).to.be.false;
      expect(utilsService.showMsg.calledOnce).to.be.true;
      expect(utilsService.showMsg.calledWith('Delete Expense', 100)).to.be.true;
      expect(explistwrapperService.deleteItem.calledOnce).to.be.false;
    });
    it('should execute modifyExpense, call ajax & load data - Success', function () {
      $httpBackend.expectPOST('./edit/modify');
      $httpBackend.when('POST', './edit/modify').respond({code: 0});

      expect(editService.data.loading).to.be.false;
      editService.data.expense = {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2011.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}};
      editService.modifyExpense();
      expect(editService.data.loading).to.be.true;
      $httpBackend.flush();

      expect(editService.data.loading).to.be.false;
      expect(utilsService.showMsg.calledOnce).to.be.true;
      expect(utilsService.showMsg.calledWith('Modify Expense', 0)).to.be.true;
      expect(explistwrapperService.modifyItem.calledOnce).to.be.true;
      expect(explistwrapperService.modifyItem.calledWith(8946)).to.be.true;
    });
    it('should execute modifyExpense, call ajax & load data - Failure', function () {
      $httpBackend.expectPOST('./edit/modify');
      $httpBackend.when('POST', './edit/modify').respond({code: 100});

      expect(editService.data.loading).to.be.false;
      editService.data.expense = {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2011.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}};
      editService.modifyExpense();
      expect(editService.data.loading).to.be.true;
      $httpBackend.flush();

      expect(editService.data.loading).to.be.false;
      expect(utilsService.showMsg.calledOnce).to.be.true;
      expect(utilsService.showMsg.calledWith('Modify Expense', 100)).to.be.true;
      expect(explistwrapperService.modifyItem.calledOnce).to.be.false;
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      utilsService.showMsg.restore();
      explistwrapperService.deleteItem.restore();
      explistwrapperService.modifyItem.restore();
    });
  });
  after('do nothing', function () {});
});
