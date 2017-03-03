// TODO Fix this..
/* eslint no-unused-vars: "off" */
'use strict';

const numeral = require('numeral');
const summaryService = require('../services/SummaryService');
const error = 1000;

const doSummary = function (req, resp) {
  const params = {
    db: req.app.locals.db,
    log: req.app.locals.log,
    cityId: numeral(req.query.cityId).value(),
    regular: req.query.regular,
    adhoc: req.query.adhoc,
    forecast: req.query.forecast
  };

  console.log(JSON.stringify(params));
  summaryService.buildSummaryGrid(params, function (err, grid) {
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
