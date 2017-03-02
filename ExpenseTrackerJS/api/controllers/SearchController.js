'use strict';

const transactions = require('../models/Transactions')();
const error = 1000;

const doSearch = function (req, resp) {
  transactions.findForSearch(req.app.locals.db, req.body).then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

module.exports = {
  doSearch: doSearch,
};
