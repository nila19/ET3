/** ** ./startup/startup.service.js *** */

(function (angular) {
  'use strict';

  const startupService = function (ms, aj, C, V) {
    const data = {
      status: 0,
      connect: false,
      loadInitiated: false
    };
    const TEN = 10;

    const loadingComplete = function () {
      // console.log('@ StartupService: Loading startup components COMPLETED...');
      ms.data.loading = false;
    };
    const loadEntryMonths = function (dt) {
      V.data.entryMonths = [];
      angular.forEach(dt.data, function (entryMonth) {
        V.data.entryMonths.push(entryMonth);
      });
      data.status += TEN;
      loadingComplete();
    };
    const getEntryMonths = function (city) {
      aj.query('/startup/months/entry', {
        cityId: city.id
      }, loadEntryMonths);
    };
    const loadTransMonths = function (dt) {
      V.data.transMonths = [];
      angular.forEach(dt.data, function (transMonth) {
        V.data.transMonths.push(transMonth);
      });
      data.status += TEN;
      getEntryMonths(V.data.city);
    };
    const getTransMonths = function (city) {
      aj.query('/startup/months/trans', {
        cityId: city.id
      }, loadTransMonths);
    };
    const loadInactiveAccounts = function (dt) {
      angular.forEach(dt.data, function (ac) {
        V.data.allAccounts.push(ac);
      });
      data.status += TEN;
      getTransMonths(V.data.city);
    };
    const getInactiveAccounts = function (city) {
      aj.query('/startup/accounts/inactive', {
        cityId: city.id
      }, loadInactiveAccounts);
    };
    const loadAccounts = function (dt) {
      angular.forEach(dt.data, function (ac) {
        V.data.accounts.push(ac);
        V.data.allAccounts.push(ac);
      });
      data.status += TEN;
      getInactiveAccounts(V.data.city);
    };
    const getAccounts = function (city) {
      aj.query('/startup/accounts', {
        cityId: city.id
      }, loadAccounts);
    };
    const loadDescriptions = function (dt) {
      V.data.descriptions = dt.data;
      data.status += TEN;
      getAccounts(V.data.city);
    };
    const getDescriptions = function (city) {
      aj.query('/startup/descriptions', {
        cityId: city.id
      }, loadDescriptions);
    };
    const loadAllCategories = function (dt) {
      V.data.allCategories = dt.data;
      data.status += TEN;
      getDescriptions(V.data.city);
    };
    const getAllCategories = function (city) {
      aj.query('/startup/categories/all', {
        cityId: city.id
      }, loadAllCategories);
    };
    const loadCategories = function (dt) {
      V.data.categories = dt.data;
      data.status += TEN;
      getAllCategories(V.data.city);
    };
    const getCategories = function (city) {
      aj.query('/startup/categories', {
        cityId: city.id
      }, loadCategories);
    };
    const loadCities = function (dt) {
      V.data.cities = dt.data;
      data.status += TEN;
      getCategories(V.data.city);
    };
    const getCities = function () {
      aj.query('/startup/cities', {}, loadCities);
    };
    const loadDefaultCity = function (dt) {
      V.data.city = dt.data;
      data.status += TEN;
      getCities();
    };
    const getDefaultCity = function () {
      aj.get('/startup/city/default', {}, loadDefaultCity);
    };
    const loadConnect = function (dt) {
      data.connect = dt.data;
      if (data.connect) {
        data.status += TEN;
        getDefaultCity();
      }
    };
    const connect = function () {
      aj.get('/startup/connect', {}, loadConnect);
    };
    const loadAll = function () {
      if (!data.loadInitiated) {
        ms.data.loading = true;
        data.loadInitiated = true;
        // console.log('@ StartupService: Loading startup components...');
        connect();
      }
    };
    const loadOthers = function () {
      ms.data.loading = true;
      // console.log('@ StartupService: Loading items on city change...');
      getCategories(V.data.city);
    };

    return {
      data: data,
      loadAll: loadAll,
      loadOthers: loadOthers,
    };
  };

  angular.module('startup').factory('startupService', startupService);
  startupService.$inject = ['etmenuService', 'ajaxService', 'CONSTANTS', 'VALUES'];
})(window.angular);
