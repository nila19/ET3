/* global sinon, inject, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('billpay.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute loadData', function () {
    let billpayService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_billpayService_) {
        billpayService = _billpayService_;
      });
    });
    it('should loadData', function () {
      const dt = {id: 100, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-03-01T13:10:01-06:00', billDt: '2017-03-22', dueDt: '2017-04-19', closed: true, amount: 203.259999999, balance: 143.2599999999, payments: [{id: 8571, transDt: '2017-04-12', amount: 50}, {id: 8572, transDt: '2017-04-13', amount: 10}], name: 'Chase Freedom : 2017-03-22 #100'};

      billpayService.loadData(dt);

      expect(billpayService.data.account).to.be.empty;
      expect(billpayService.data.paidDt).to.be.empty;
      expect(billpayService.data.bill.balance).to.equal(143.26);
      expect(billpayService.data.bill.amount).to.equal(203.26);
      expect(billpayService.data.paidAmt).to.equal(billpayService.data.bill.balance);
    });
    afterEach('rollback mocks', function () {});
  });
  // case #1
  describe('Execute payBill', function () {
    let billpayService = null;
    let etmenuService = null;
    let ajaxService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_billpayService_, _etmenuService_, _ajaxService_) {
        billpayService = _billpayService_;
        etmenuService = _etmenuService_;
        ajaxService = _ajaxService_;
      });
    });
    it('should payBill', function () {
      sinon.spy(ajaxService, 'post');

      expect(billpayService.data.city).to.be.null;
      etmenuService.data.menu.city = {id: 20140301};
      billpayService.payBill();

      const dt = {city: {id: 20140301}, bill: null, account: '', paidAmt: 0, paidDt: ''};

      expect(billpayService.data.city.id).to.equal(20140301);
      expect(ajaxService.post.calledOnce).to.be.true;
      expect(ajaxService.post.calledWith('/edit/paybill', dt)).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.post.restore();
    });
  });
  // case #2
  describe('Execute payBill - make ajax call', function () {
    let $httpBackend = null;
    let billpayService = null;
    let billsService = null;
    let etmenuService = null;
    let explistwrapperService = null;
    let utilsService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_billpayService_, _billsService_, _etmenuService_, _explistwrapperService_, _utilsService_) {
        billpayService = _billpayService_;
        billsService = _billsService_;
        etmenuService = _etmenuService_;
        explistwrapperService = _explistwrapperService_;
        utilsService = _utilsService_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.expectPOST('./edit/paybill');
    }));
    it('should execute payBill, call ajax & load data - Success.', function () {
      $httpBackend.expectGET('./dashboard/transaction/8947');
      $httpBackend.when('POST', './edit/paybill').respond({code: 0, data: {id: 8947, cityId: 20140301, entryDt: '2017-06-22T09:53:27-05:00', entryMonth: '2017-06-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 20.12, transDt: '2017-06-05', transMonth: '2017-06-01', seq: 8947, accounts: {from: {id: 80, name: 'Chase Checking', balanceBf: 4043.0699999999997, balanceAf: 4043.0699999999997}, to: {id: 83, name: 'Chase Freedom', balanceBf: -861.74, balanceAf: -861.74}}, adhoc: false, adjust: true, status: true, tallied: false, tallyDt: null}});
      $httpBackend.when('GET', './dashboard/transaction/8947').respond({code: 0, data: {id: 8947, cityId: 20140301, entryDt: '2017-06-22T09:53:27-05:00', entryMonth: '2017-06-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 20.12, transDt: '2017-06-05', transMonth: '2017-06-01', seq: 8947, accounts: {from: {id: 80, name: 'Chase Checking', balanceBf: 4043.0699999999997, balanceAf: 4022.95}, to: {id: 83, name: 'Chase Freedom', balanceBf: -861.74, balanceAf: -881.86}}, adhoc: false, adjust: true, status: true, tallied: false, tallyDt: null}});
      sinon.stub(utilsService, 'showMsg');
      sinon.spy(explistwrapperService, 'addItem');

      expect(billpayService.data.city).to.be.null;
      etmenuService.data.menu.city = {id: 20140301};
      billsService.data.loading = true;
      billpayService.payBill();

      expect(billpayService.data.city.id).to.equal(20140301);
      $httpBackend.flush();
      expect(billsService.data.loading).to.be.false;
      expect(utilsService.showMsg.calledOnce).to.be.true;
      expect(utilsService.showMsg.calledWith('Bill Pay', 0)).to.be.true;
      expect(explistwrapperService.addItem.calledOnce).to.be.true;
      expect(explistwrapperService.addItem.calledWith(8947)).to.be.true;
    });
    it('should execute payBill, call ajax & load data - Failure.', function () {
      $httpBackend.when('POST', './edit/paybill').respond({code: 100, data: {id: 8947, cityId: 20140301, entryDt: '2017-06-22T09:53:27-05:00', entryMonth: '2017-06-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 20.12, transDt: '2017-06-05', transMonth: '2017-06-01', seq: 8947, accounts: {from: {id: 80, name: 'Chase Checking', balanceBf: 4043.0699999999997, balanceAf: 4043.0699999999997}, to: {id: 83, name: 'Chase Freedom', balanceBf: -861.74, balanceAf: -861.74}}, adhoc: false, adjust: true, status: true, tallied: false, tallyDt: null}});
      sinon.stub(utilsService, 'showMsg');
      sinon.spy(explistwrapperService, 'addItem');

      expect(billpayService.data.city).to.be.null;
      etmenuService.data.menu.city = {id: 20140301};
      billsService.data.loading = true;
      billpayService.payBill();

      expect(billpayService.data.city.id).to.equal(20140301);
      $httpBackend.flush();
      expect(billsService.data.loading).to.be.false;
      expect(utilsService.showMsg.calledOnce).to.be.true;
      expect(utilsService.showMsg.calledWith('Bill Pay', 100)).to.be.true;
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
