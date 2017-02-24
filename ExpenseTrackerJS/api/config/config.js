/* eslint no-magic-numbers: "off" */

'use strict';

module.exports = {
  port: 3000,
  dburl: 'localhost:27017/expense',
  sqlite: 'C:\\Java\\SQLite\\Data\\Test4.db',
  log: {
    path: 'C:\\Java\\logs\\TestExpress.log',
    period: '1m',
    count: 12
  },
  thinList: 100,
  pct75: 0.75,
  pct125: 1.25,
};
