'use strict';

const categories = require('../models/Categories')();

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Categories data started...');
    sqlite.each('SELECT * FROM CATEGORY', function (err, row) {
      if(err) {
        log.error(err);
      } else {
        const category = {
          id: row.CATEGORY_ID,
          name: row.MAIN_CATEGORY + ' ~ ' + row.SUB_CATEGORY,
          cityId: row.DATA_KEY,
          mainDesc: row.MAIN_CATEGORY,
          subDesc: row.SUB_CATEGORY,
          icon: row.IMAGE_CODE,
          active: row.STATUS === 'A',
          seq: row.DISPLAY_ORDER,
        };

        categories.insert(mongo, category);
        count += 1;
      }
    }, function () {
      log.info('Categories data over... : ' + count);
      return next();
    });
  });
};

module.exports = function (sqlite, mongo, log, next) {
  return migrate(sqlite, mongo, log, function () {
    return next();
  });
};
