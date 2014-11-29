"use strict";

var index = require('../controllers/index'),
    leagues = require('../controllers/leagues'),
    countries = require('../controllers/countries'),
    fields = require('../controllers/fields'),
    matches = require('../controllers/matches');

module.exports.initialize = function (app) {
    app.get('/', index.index);

    app.get('/construct', index.underConstruction);
    app.get('/nationals/promo', index.nationalsPromo);

    app.get('/leagues', leagues.leagues);
    app.get('/leagues/:name', leagues.league);
    app.get('/leagues/:name/match/:home-:away', matches.match);

    app.get('/fields', fields.fields);
    app.get('/fields/:name', fields.fields);

    app.get('/countries/:country', countries.countries);
};
