'use strict';

const monk = require('monk');
const config = require('./config');

module.exports = {
  connect: function (log, okToLog, next) {
    monk(config.dburl).then((db) => {
      if(okToLog) {
        log.info('Connected to :: ' + config.dburl);
      }
      next(null, db);
    }).catch((err) => {
      log.error(log.chalk.magenta(err));
      next(err);
    });
  }
};
