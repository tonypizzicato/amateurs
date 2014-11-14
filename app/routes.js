"use strict";

var index = require('../controllers/index'),
    leagues = require('../controllers/leagues');

module.exports.initialize = function (app) {
    app.get('/', index.index);
    app.get('/construct', index.underConstruction);
    app.get('/nationals/promo', index.nationalsPromo);
    app.get('/leagues', leagues.leagues);
    app.get('/leagues/:id', leagues.leagues);
};
