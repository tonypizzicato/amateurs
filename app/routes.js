"use strict";

var index = require('../controllers/index'),
    leagues = require('../controllers/leagues'),
    fields = require('../controllers/fields');

module.exports.initialize = function (app) {
    app.get('/', index.index);
    app.get('/construct', index.underConstruction);
    app.get('/nationals/promo', index.nationalsPromo);
    app.get('/leagues', leagues.leagues);
    app.get('/leagues/:name', leagues.leagues);
    app.get('/fields', fields.fields);
    app.get('/fields/:name', fields.fields);
};
