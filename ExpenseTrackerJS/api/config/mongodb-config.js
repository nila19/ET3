'use strict';

const monk = require('monk');
const config = require('./config');

module.exports = {
  connect: function (log, next) {
    monk(config.dburl).then((db) => {
      log.info('Connected to database...');
      next(db);
    }).catch((err) => {
      log.error(log.chalk.magenta(err));
    });
  }
};
