"use strict";

var express   = require('express'),

    auth      = require('../controllers/auth'),
    index     = require('../controllers/index'),
    leagues   = require('../controllers/leagues'),
    countries = require('../controllers/countries'),
    fields    = require('../controllers/fields'),
    matches   = require('../controllers/matches'),
    apiNews   = require('../controllers/api/news');

module.exports.initialize = function (app) {
    app.get('/', index.index);


    app.get('/login', auth.loginPage);
    app.get('/account', auth.account);
    app.post('/login', auth.login);
    app.post('/logout', auth.logout);


    app.get('/construct', index.underConstruction);
    app.get('/nationals/promo', index.nationalsPromo);

    app.get('/leagues', leagues.leagues);
    app.get('/leagues/:name', leagues.league);
    app.get('/leagues/:name/table', leagues.table);
    app.get('/leagues/:name/match/:home-:away', matches.match);

    app.get('/fields', fields.fields);
    app.get('/fields/:name', fields.fields);

    app.get('/countries/:country', countries.countries);


    var apiRouter = express.Router(),
        r = express.Router();


    r.route('/news')
        .get(apiNews.list)
        .post(apiNews.create);

    r.route('/news/:id')
        .get(apiNews.item)
        .put(apiNews.save)
        .delete(apiNews.delete);

    apiRouter.use(r);

    app.use('/api', apiRouter);

};
