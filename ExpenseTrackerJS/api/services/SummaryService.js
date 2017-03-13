'use strict';

const Promise = require('bluebird');
const moment = require('moment');
const fmt = require('../config/formats');
const categories = require('../models/Categories')();
const transactions = require('../models/Transactions')();
const monthUtils = require('../utils/month-utils');
const cu = require('../utils/common-utils');

const buildSummary = function (parms) {
  return new Promise(function (resolve, reject) {
    let data = null;

    getDataFromDB(parms).then((data1) => {
      data = data1;
      return buildEmptyGrid(data);
    }).then((grid) => {
      return populateGrid(data, grid);
    }).then((grid) => {
      return calcYearlySummary(data, grid);
    }).then((grid) => {
      return buildForecastGrid(parms, data, grid);
    }).then((grid) => {
      return weedInactiveCats(grid);
    }).then((grid) => {
      return sortGridByCategory(data, grid);
    }).then((gridArr) => {
      return calcTotalRow(data, gridArr);
    }).then((gridArr) => {
      return resolve(gridArr);
    }).catch((err) => {
      cu.logErr(parms.log, err);
      return reject(err);
    });
  });
};

// step - 0 : initial method to fetch all data from DB..
const getDataFromDB = function (param) {
  return new Promise(function (resolve, reject) {
    const data = {};

    categories.findForCity(param.db, param.cityId).then((docs) => {
      data.categories = docs;
      return transactions.findAllTransMonths(param.db, param.cityId);
    }).then((docs) => {
      return monthUtils.buildMonthsList(docs, param.log);
    }).then((months) => {
      data.transMonths = months;
      return transactions.findForMonthlySummary(param.db, param.cityId, param.regular, param.adhoc);
    }).then((docs) => {
      data.transactions = docs;
      return transactions.findForForecast(param.db, param.cityId);
    }).then((docs) => {
      data.fcTransactions = docs;
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};

// setp 1: build empty grid with 1 row for  each category.
const buildEmptyGrid = function (data) {
  return new Promise(function (resolve) {
    const grid = {};

    data.categories.forEach(function (category) {
      const ui = {category: category, amount: [], count: []};

      data.transMonths.forEach(function () {
        ui.amount.push(0);
        ui.count.push(0);
      });
      grid[category.id] = ui;
    });
    return resolve(grid);
  });
};

// setp 2: populate the grid with transaction data.
const populateGrid = function (data, grid) {
  return new Promise(function (resolve) {
    data.transactions.forEach(function (tran) {
      const ui = grid[tran.category.id];
      const idx = getMonthIndex(data.transMonths, tran.transMonth);

      ui.amount[idx] += tran.amount;
      ui.count[idx] += 1;
    });
    return resolve(grid);
  });
};

// setp 3: populate the yearly summary columns with totals from the months of the year.
// yearly Summary - For each SummaryUI, populate the yearly totals by summing up the months for that year.
// pick only the non-aggregate months for totaling.
const calcYearlySummary = function (data, grid) {
  return new Promise(function (resolve) {
    data.transMonths.forEach(function (year, ii) {
      if(year.aggregate) {
        data.transMonths.forEach(function (month, jj) {
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
    return resolve(grid);
  });
};

// setp 4: build forecast grid, if the forecast flag is on. if the flag is not on, proceed forward.
const buildForecastGrid = function (param, data, grid) {
  return new Promise(function (resolve, reject) {
    if(!param.forecast) {
      return resolve(grid);
    }
    buildEmptyGrid(data).then((fcgrid) => {
      return populateFcGrid(data, fcgrid);
    }).then((fcgrid) => {
      return embedFcToGrid(data, grid, fcgrid);
    }).then((grid) => {
      return resolve(grid);
    }).catch((err) => {
      return reject(err);
    });
  });
};

// setp 4.1: populate the forecast grid with fctransaction data.
const populateFcGrid = function (data, fcgrid) {
  return new Promise(function (resolve) {
    data.fcTransactions.forEach(function (trans) {
      const ui = fcgrid[trans.category.id];

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
    return resolve(fcgrid);
  });
};

// setp 4.2: embed the main grid with fctransaction data.
const embedFcToGrid = function (data, grid, fcgrid) {
  return new Promise(function (resolve) {
    const idx = getMonthIndex(data.transMonths, moment().format(fmt.YYYYMMDD));

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
    return resolve(grid);
  });
};

// setp 5: identify inactive categories with no transactions ever & remove them from grid.
const weedInactiveCats = function (grid) {
  return new Promise(function (resolve) {
    const weeds = [];

    for (const catId in grid) {
      if (grid.hasOwnProperty(catId)) {
        const ui = grid[catId];

        if(!ui.category.active) {
          let nonzero = false;

          ui.amount.forEach(function (amt) {
            if(amt !== 0) {
              nonzero = true;
            }
          });
          if(!nonzero) {
            weeds.push(catId);
          }
        }
      }
    }
    weeds.forEach(function (weed) {
      delete grid[weed];
    });
    return resolve(grid);
  });
};

// setp 6: sort them based on Category sort order.
const sortGridByCategory = function (data, grid) {
  return new Promise(function (resolve) {
    const gridArr = [];

    data.categories.forEach(function (category) {
      if(grid[category.id]) {
        gridArr.push(grid[category.id]);
      }
    });
    return resolve(gridArr);
  });
};

// setp 7: calculate monthly total row & add it as top row.
const calcTotalRow = function (data, gridArr) {
  return new Promise(function (resolve) {
    const totalui = {amount: [], count: []};

    data.transMonths.forEach(function () {
      totalui.amount.push(0);
      totalui.count.push(0);
    });
    gridArr.forEach(function (ui) {
      data.transMonths.forEach(function (month, ii) {
        totalui.amount[ii] += ui.amount[ii];
      });
    });
    gridArr.unshift(totalui);
    return resolve(gridArr);
  });
};
// utility function
const getMonthIndex = function (months, date) {
  const month = monthUtils.getMonth(date);
  let pos = -1;
  let i = 0;

  while (i < months.length && pos < 0) {
    pos = (month.seq === months[i].seq) ? i : -1;
    i += 1;
  }
  return pos;
};

module.exports = {
  buildSummary: buildSummary,
};
