'use strict';

const categories = require('../api/models/Categories')();

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function f1() {
    let count = 0;

    log.info('Categories data started...');
    sqlite.each('SELECT * FROM CATEGORY', function fn(err, row) {
      if(err) {
        log.error(err);
      } else {
        const category = {
          catId: row.CATEGORY_ID,
          cityId: row.DATA_KEY,
          mainDesc: row.MAIN_CATEGORY,
          subDesc: row.SUB_CATEGORY,
          icon: row.IMAGE_CODE,
          status: row.STATUS,
          seq: row.DISPLAY_ORDER,
        };

        categories.insert(mongo, category);
        count += 1;
      }
    }, function done() {
      log.info('Categories data over... : ' + count);
      return next();
    });
  });
};

module.exports = function exp(sqlite, mongo, log, next) {
  return migrate(sqlite, mongo, log, function cb() {
    return next();
  });
};
