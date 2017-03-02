// TODO Fix this..
/* eslint no-unused-vars: "off" */
'use strict';

const summaryService = require('../services/SummaryService');
const error = 1000;

const doSummary = function (req, resp) {
  const params = {
    db: req.app.locals.db,
    log: req.app.locals.log,
    cityId: req.body.cityId,
    regular: req.body.regular,
    adhoc: req.body.adhoc,
    forecast: req.body.forecast
  };

  summaryService.buildSummaryGrid(params, function aa(err, grid) {
    if(err) {
      req.app.locals.log.error(err);
      return resp.json({code: error});
    } else {
      return resp.json({code: 0, data: grid});
    }
  });
};

const doChart = function (req, resp) {
  // TODO create a service.
};

module.exports = {
  doSummary: doSummary,
  doChart: doChart
};
