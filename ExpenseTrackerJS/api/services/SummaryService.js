'use strict';

const moment = require('moment');
const async = require('async');
const serviceUtils = require('./SummaryServiceUtils');
let param = null;
const data = null;

// step 0: use serviceUtils to fetch all data from DB & build the trans months list.
const buildSummaryGrid = function (params, next) {
  param = params;
  serviceUtils.getDataFromDB(params, function aa(err, results) {
    if(err) {
      param.log.error(err);
      return next(err);
    }
    data.categories = results[0];
    data.transMonths = results[1];
    data.transactions = results[2];
    data.fcTransactions = results[3];

    async.waterfall([buildEmptyGrid, populateGrid, calcYearlySummary,
      buildForecastGrid, weedInactiveCats], function cb(err, grid) {
      if(err) {
        param.log.error(err);
        return next(err);
      }
      return next(null, grid);
    });
  });
};

// setp 1: build empty grid with 1 row for  each category.
const buildEmptyGrid = function (next) {
  const grid = {};

  data.categories.forEach(function bb(category) {
    const ui = {category: category, amount: [], count: []};

    data.transMonths.forEach(function cc() {
      ui.amount.push(0);
      ui.count.push(0);
    });
    grid[category.catId] = ui;
  });
  return next(null, grid);
};

// setp 2: populate the grid with transaction data.
const populateGrid = function (grid, next) {
  data.transactions.forEach(function aa(trans) {
    const ui = grid[trans.catId];
    const idx = serviceUtils.getMonthIndex(data.transMonths, trans.transMonth);

    ui.amount[idx] += trans.amount;
    ui.count[idx] += 1;
  });
  return next(null, grid);
};

// setp 3: populate the yearly summary columns with totals from the months of the year.
// yearly Summary - For each SummaryUI, populate the yearly totals by summing up the months for that year.
// pick only the non-aggregate months for totaling.
const calcYearlySummary = function (grid, next) {
  data.transMonths.forEach(function cc(year, ii) {
    if(year.aggregate) {
      data.transMonths.forEach(function cc(month, jj) {
        if(!month.aggregate && year.year === month.year) {
          for (const catId in grid) {
            if (grid.hasOwnProperty(catId)) {
              const ui = grid[catId];

              ui.amount[ii] += ui.amount[jj];
              ui.count[ii] += ui.count[jj];
            }
          }
        }
      });
    }
  });
  return next(null, grid);
};

// setp 4: build forecast grid, if the forecast flag is on. if the flag is not on, proceed forward.
let grid = null;
const buildForecastGrid = function (grid1, next) {
  if(!param.forecast) {
    return next(null, grid);
  }

  grid = grid1;
  async.waterfall([buildEmptyGrid, populateFcGrid, embedFcToGrid], function cb(err, grid) {
    if(err) {
      param.log.error(err);
      return next(err);
    }
    return next(null, grid);
  });
};

// setp 4.1: populate the forecast grid with fctransaction data.
const populateFcGrid = function (fcgrid, next) {
  data.fcTransactions.forEach(function aa(trans) {
    const ui = fcgrid[trans.catId];

    ui.amount[0] += trans.amount;
    ui.count[0] += 1;
  });
  for (const catId in fcgrid) {
    if (fcgrid.hasOwnProperty(catId)) {
      const fcui = fcgrid[catId];

      fcui.amount[0] = fcui.amount[0] / 3;
      fcui.count[0] = fcui.count[0] / 3;
    }
  }
  return next(null, fcgrid);
};

// setp 4.2: embed the main grid with fctransaction data.
const embedFcToGrid = function (fcgrid, next) {
  const idx = serviceUtils.getMonthIndex(data.transMonths, moment().valueOf());

  for (const catId in fcgrid) {
    if (fcgrid.hasOwnProperty(catId)) {
      const fcui = fcgrid[catId];
      const ui = grid[catId];

      if(ui.amount[idx] < fcui.amount[0]) {
        ui.amount[idx] = fcui.amount[0];
        ui.count[idx] = fcui.count[0];
      }
    }
  }
  return next(null, grid);
};

// setp 5: identify inactive categories with no transactions ever & remove them from grid.
const weedInactiveCats = function (grid, next) {
  const weeds = [];
  // TODO Fix this...

  return next(null, grid);
};

module.exports = {
  buildSummaryGrid: buildSummaryGrid,
};
