"use strict";

var express          = require('express'),

    auth             = require('../controllers/auth'),
    index            = require('../controllers/index'),
    leagues          = require('../controllers/leagues'),
    tournaments      = require('../controllers/tournaments'),
    games            = require('../controllers/games'),
    countries        = require('../controllers/countries'),
    fields           = require('../controllers/fields'),
    matches          = require('../controllers/matches'),
    teams            = require('../controllers/teams'),
    news             = require('../controllers/news'),

    apiNews          = require('../controllers/api/news'),
    apiCountries     = require('../controllers/api/countries'),
    apiLeagues       = require('../controllers/api/leagues'),
    apiTournaments   = require('../controllers/api/tournaments'),
    apiGames         = require('../controllers/api/games'),
    apiArticlesGames = require('../controllers/api/game-articles'),
    apiPhotos        = require('../controllers/api/photos'),
    apiContacts      = require('../controllers/api/contacts');

module.exports.initialize = function (app) {
    var apiRouter = express.Router(),
        r = express.Router();

    r.route('/news')
        .get(apiNews.list)
        .post(apiNews.create);

    r.route('/news/:id')
        .get(apiNews.item)
        .put(apiNews.save)
        .delete(apiNews.delete);

    r.route('/leagues')
        .get(apiLeagues.list);

    r.route('/leagues/:id')
        .get(apiLeagues.item)
        .put(apiLeagues.save);

    r.route('/tournaments')
        .get(apiTournaments.list)
        .post(apiTournaments.create);

    r.route('/tournaments/:id')
        .get(apiTournaments.item)
        .put(apiTournaments.save)
        .delete(apiTournaments.delete);

    r.route('/countries')
        .get(apiCountries.list)
        .post(apiCountries.create);

    r.route('/countries/:id')
        .get(apiCountries.item)
        .put(apiCountries.save)
        .delete(apiCountries.delete);

    r.route('/games')
        .get(apiGames.list);

    r.route('/:type/:postId/images')
        .get(apiPhotos.list)
        .post(apiPhotos.create);

    r.route('/:type/:postId/images/:id')
        .get(apiPhotos.list)
        .put(apiPhotos.save)
        .delete(apiPhotos.delete);

    r.route('/game-articles')
        .get(apiArticlesGames.list)
        .post(apiArticlesGames.create);

    r.route('/game-articles/:id')
        .put(apiArticlesGames.save)
        .delete(apiArticlesGames.delete);

    r.route('/contacts')
        .get(apiContacts.list)
        .post(apiContacts.create);

    r.route('/contacts/:id')
        .put(apiContacts.save)
        .delete(apiContacts.delete);

    apiRouter.use(r);

    app.use('/api/site', apiRouter);

    app.get('/', index.index);

    app.get('/login', auth.loginPage);
    app.get('/account', auth.account);
    app.post('/login', auth.login);
    app.post('/logout', auth.logout);


    app.get('/construct', index.underConstruction);
    app.get('/nationals/promo', index.nationalsPromo);

    app.get('/:league(moscow|spb)', leagues.item);

    app.get('/:league/tournaments', tournaments.list);
    app.get('/:league/tournaments/:name', tournaments.globals, tournaments.item);
    app.get('/:league/tournaments/:name/fixture', tournaments.globals, tournaments.fixture);
    app.get('/:league/tournaments/:name/table', tournaments.globals, tournaments.table);
    app.get('/:league/tournaments/:name/matches/:id', tournaments.globals, games.item);
    app.get('/:league/tournaments/:name/stats', tournaments.globals, tournaments.stats);

    app.get('/:league/fields', fields.fields);
    app.get('/:league/fields/:name', fields.fields);

    app.get('/:league/news', news.list);
    app.get('/:league/:countries/news', news.list);
    app.get('/:league/:countries/:tournament/news', news.list);
    app.get('/:league/news/:slug', news.item);

    app.get('/:league/countries/:country', countries.item);
};
