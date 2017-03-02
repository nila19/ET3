/** ** ./startup/startup.service.js *** */

(function (angular) {
  'use strict';

  angular.module('startup').factory('startupService', startupService);

  startupService.$inject = ['etmenuService', 'ajaxService', 'CONSTANTS', 'VALUES'];
  function startupService(ms, aj, C, V) {
    const data = {
      status: 0,
      connect: false,
      loadInitiated: false
    };

    const loadingComplete = function () {
      console.log('@ StartupService: Loading startup components COMPLETED...');
      ms.data.loading = false;
    };
    const loadEntryMonths = function (entryMonths) {
      V.data.entryMonths = [];
      angular.forEach(entryMonths, function (entryMonth) {
        V.data.entryMonths.push(entryMonth.toJSON());
      });
      data.status += 10;
      loadingComplete();
    };
    const getEntryMonths = function (city) {
      aj.query('/startup/months/entry', {
        city: city.id
      }, loadEntryMonths);
    };
    const loadTransMonths = function (transMonths) {
      V.data.transMonths = [];
      angular.forEach(transMonths, function (transMonth) {
        V.data.transMonths.push(transMonth.toJSON());
      });
      data.status += 10;
      getEntryMonths(V.data.city);
    };
    const getTransMonths = function (city) {
      aj.query('/startup/months/trans', {
        city: city.id
      }, loadTransMonths);
    };
    const loadInactiveAccounts = function (accounts) {
      angular.forEach(accounts, function (ac) {
        V.data.allAccounts.push(ac);
      });
      data.status += 10;
      getTransMonths(V.data.city);
    };
    const getInactiveAccounts = function (city) {
      aj.query('/startup/accounts/inactive', {
        city: city.id
      }, loadInactiveAccounts);
    };
    const loadAccounts = function (accounts) {
      angular.forEach(accounts, function (ac) {
        V.data.accounts.push(ac);
        V.data.allAccounts.push(ac);
      });
      data.status += 10;
      getInactiveAccounts(V.data.city);
    };
    const getAccounts = function (city) {
      aj.query('/startup/accounts', {
        city: city.id
      }, loadAccounts);
    };
    const loadDescriptions = function (descriptions) {
      V.data.descriptions = descriptions;
      data.status += 10;
      getAccounts(V.data.city);
    };
    const getDescriptions = function (city) {
      aj.query('/startup/descriptions', {
        city: city.id
      }, loadDescriptions);
    };
    const loadAllCategories = function (categories) {
      V.data.allCategories = categories;
      data.status += 10;
      getDescriptions(V.data.city);
    };
    const getAllCategories = function (city) {
      aj.query('/startup/categories/all', {
        city: city.id
      }, loadAllCategories);
    };
    const loadCategories = function (categories) {
      V.data.categories = categories;
      data.status += 10;
      getAllCategories(V.data.city);
    };
    const getCategories = function (city) {
      aj.query('/startup/categories', {
        city: city.id
      }, loadCategories);
    };
    const loadCities = function (cities) {
      V.data.cities = cities;
      data.status += 10;
      getCategories(V.data.city);
    };
    const getCities = function () {
      aj.query('/startup/cities', {}, loadCities);
    };
    const loadDefaultCity = function (city) {
      V.data.city = city;
      data.status += 10;
      getCities();
    };
    const getDefaultCity = function () {
      aj.get('/startup/city/default', {}, loadDefaultCity);
    };
    const loadConnect = function (conn) {
      data.connect = conn.flag;
      if (data.connect) {
        data.status += 10;
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
        console.log('@ StartupService: Loading startup components...');
        connect();
      }
    };
    const loadOthers = function () {
      ms.data.loading = true;
      console.log('@ StartupService: Loading items on city change...');
      getCategories(V.data.city);
    };

    return {
      data: data,
      loadAll: loadAll,
      loadOthers: loadOthers,
    };
  }
})(window.angular);
