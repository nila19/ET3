/* eslint no-magic-numbers: "off" */
'use strict';

const argv = require('minimist')(process.argv.slice(2));

const root = {
  thinList: 100,
  pct75: 0.75,
  pct125: 1.25,
  error: 1000
};

const regions = {
  prod: {
    env: 'PROD',
    port: 3000,
    dburl: 'localhost:27017/expense',
    billcloser: true,
    blocked: {
      on: true,
      threshold: 50 // milliseconds
    },
    log: {
      path: 'C:\\Java\\logs\\ExpenseTracker.log',
      period: '1m',
      count: 12
    },
  },
  dev: {
    env: 'DEV',
    port: 3300,
    dburl: 'localhost:27017/test',
    sqlite: 'C:\\Java\\SQLite\\Data\\Prod - v2017.03.13.db',
    billcloser: false,
    blocked: {
      on: false,
      threshold: 50 // milliseconds
    },
    log: {
      path: 'C:\\Java\\logs\\ExpenseTracker-Test.log',
      period: '1m',
      count: 12
    },
  },
};

const cfg = {};
const loadConfig = function () {
  const region = (argv.region && regions[argv.region]) ? argv.region : 'dev';

  Object.assign(cfg, root, regions[region]);
};

loadConfig();

module.exports = cfg;
