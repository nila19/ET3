/* global sinon, inject, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('add.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute initializeData', function () {
    let addService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_addService_) {
        addService = _addService_;
      });
    });
    it('should initializeData', function () {
      addService.initializeData();

      expect(addService.data.expense.adjust).to.be.false;
      expect(addService.data.expense.adhoc).to.be.false;
      expect(addService.data.expense.category).to.be.null;
      expect(addService.data.expense.accounts.from).to.be.null;
      expect(addService.data.expense.accounts.to).to.be.null;
      expect(addService.data.expense.description).to.be.empty;
      expect(addService.data.expense.amount).to.be.empty;
      expect(addService.data.expense.transDt).to.be.empty;
    });
    afterEach('rollback mocks', function () {});
  });
  // case #1
  describe('Execute addExpense', function () {
    let addService = null;
    let etmenuService = null;
    let ajaxService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_addService_, _etmenuService_, _ajaxService_) {
        addService = _addService_;
        etmenuService = _etmenuService_;
        ajaxService = _ajaxService_;
      });
    });
    it('should addExpense', function () {
      sinon.spy(ajaxService, 'post');

      expect(addService.data.expense.city).to.be.null;
      etmenuService.data.menu.city = {id: 20140301};
      addService.addExpense();

      const expense = {city: {id: 20140301}, adjust: false, adhoc: false, category: null, accounts: {from: null, to: null}, description: '', amount: '', transDt: ''};

      expect(ajaxService.post.calledOnce).to.be.true;
      expect(ajaxService.post.calledWith('/edit/add', expense)).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.post.restore();
    });
  });
  // case #2
  describe('Execute addExpense - make ajax call', function () {
    let $httpBackend = null;
    let addService = null;
    let etmenuService = null;
    let explistwrapperService = null;
    let utilsService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_addService_, _etmenuService_, _explistwrapperService_, _utilsService_) {
        addService = _addService_;
        etmenuService = _etmenuService_;
        explistwrapperService = _explistwrapperService_;
        utilsService = _utilsService_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.expectPOST('./edit/add');
    }));
    it('should execute addExpense, call ajax & load data - Success.', function () {
      $httpBackend.expectGET('./dashboard/transaction/8946');
      $httpBackend.when('POST', './edit/add').respond({code: 0, data: {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2001.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: 0}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}, _id: '594b5cca2fb4b148a4e4c619'}});
      $httpBackend.when('GET', './dashboard/transaction/8946').respond({code: 0, data: {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2011.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}}});
      sinon.stub(utilsService, 'showMsg');
      sinon.spy(explistwrapperService, 'addItem');

      expect(addService.data.expense.city).to.be.null;
      etmenuService.data.menu.city = {id: 20140301};
      addService.addExpense();

      expect(addService.data.expense.city.id).to.equal(20140301);
      $httpBackend.flush();
      expect(addService.data.expense.description).to.be.empty;
      expect(addService.data.expense.amount).to.be.empty;
      expect(utilsService.showMsg.calledOnce).to.be.true;
      expect(utilsService.showMsg.calledWith('Add Expense', 0)).to.be.true;
      expect(explistwrapperService.addItem.calledOnce).to.be.true;
      expect(explistwrapperService.addItem.calledWith(8946)).to.be.true;
    });
    it('should execute addExpense, call ajax & load data - Failure.', function () {
      $httpBackend.when('POST', './edit/add').respond({code: 100, data: {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2001.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: 0}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}, _id: '594b5cca2fb4b148a4e4c619'}});
      sinon.stub(utilsService, 'showMsg');
      sinon.spy(explistwrapperService, 'addItem');

      expect(addService.data.expense.city).to.be.null;
      etmenuService.data.menu.city = {id: 20140301};
      addService.addExpense();

      expect(addService.data.expense.city.id).to.equal(20140301);
      $httpBackend.flush();
      expect(addService.data.expense.description).to.be.empty;
      expect(addService.data.expense.amount).to.be.empty;
      expect(utilsService.showMsg.calledOnce).to.be.true;
      expect(utilsService.showMsg.calledWith('Add Expense', 100)).to.be.true;
      expect(explistwrapperService.addItem.calledOnce).to.be.false;
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      utilsService.showMsg.restore();
      explistwrapperService.addItem.restore();
    });
  });
  after('do nothing', function () {});
});
