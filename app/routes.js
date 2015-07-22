"use strict";

var express          = require('express'),

    auth             = require('../controllers/auth'),
    index            = require('../controllers/index'),
    leagues          = require('../controllers/leagues'),
    tournaments      = require('../controllers/tournaments'),
    games            = require('../controllers/games'),
    countries        = require('../controllers/countries'),
    fields           = require('../controllers/fields'),
    contacts         = require('../controllers/contacts'),
    teams            = require('../controllers/teams'),
    news             = require('../controllers/news'),
    orders           = require('../controllers/orders'),

    apiNews          = require('../controllers/api/news'),
    apiCountries     = require('../controllers/api/countries'),
    apiLeagues       = require('../controllers/api/leagues'),
    apiTournaments   = require('../controllers/api/tournaments'),
    apiGames         = require('../controllers/api/games'),
    apiArticlesGames = require('../controllers/api/game-articles'),
    apiPhotos        = require('../controllers/api/photos'),
    apiFields        = require('../controllers/api/fields'),
    apiContacts      = require('../controllers/api/contacts'),
    apiCategories    = require('../controllers/api/categories'),
    apiOrders        = require('../controllers/api/orders');

module.exports.initialize = function (app) {
    var apiRouter = express.Router(),
        r         = express.Router();

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

    r.route('/games/:id')
        .put(apiGames.save);

    r.route('/:type/:postId/images')
        .get(apiPhotos.list)
        .post(require('multer')({
            dest:     __dirname + '/../public/uploads/',
            inMemory: true
        }), apiPhotos.create);

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

    r.route('/game-articles/:type/:gameId')
        .get(apiArticlesGames.byGame);

    r.route('/fields')
        .get(apiFields.list)
        .post(apiFields.create);

    r.route('/fields/:id')
        .put(apiFields.save)
        .delete(apiFields.delete);

    r.route('/contacts')
        .get(apiContacts.list)
        .post(apiContacts.create);

    r.route('/contacts/:id')
        .put(apiContacts.save)
        .delete(apiContacts.delete);

    r.route('/categories')
        .get(apiCategories.list)
        .post(apiCategories.create);

    r.route('/categories/:id')
        .put(apiCategories.save)
        .delete(apiCategories.delete);

    r.route('/orders')
        .get(apiOrders.list);

    apiRouter.use(r);

    app.use('/api', apiRouter);



    app.get('/about', function(req, res) {
        res.render('static/about', {pageAbout: true});
    });

    app.get('/login', auth.loginPage);
    app.get('/account', auth.account);
    app.post('/login', auth.login);
    app.post('/logout', auth.logout);

    app.post('/orders', orders.create);


    app.get('/:league/tournaments/:name/fixture', news.pre, tournaments.globals, tournaments.fixture);
    app.get('/:league/tournaments/:name/table', news.pre, tournaments.globals, tournaments.table);
    app.get('/:league/tournaments/:name/matches/:id', news.pre, tournaments.globals, games.item);
    app.get('/:league/tournaments/:name/stats', news.pre, tournaments.globals, tournaments.stats);
    app.get('/:league/tournaments/:name/teams/', news.pre, tournaments.globals, teams.list);
    app.get('/:league/tournaments/:name/teams/:id', news.pre, tournaments.globals, teams.item);
    app.get('/:league/tournaments/:name/fields/', news.pre, tournaments.globals, fields.list);
    app.get('/:league/tournaments/:name/fields/:fieldName', news.pre, tournaments.globals, fields.item);
    app.get('/:league/tournaments/:name', news.pre, tournaments.globals, tournaments.item);

    app.get('/:league(moscow|spb)', news.pre, leagues.item);

    app.get('/:league/contacts', news.pre, news.globals, contacts.list);
    app.get('/:league/fields', news.pre, news.globals, fields.list);
    app.get('/:league/fields/:fieldName', news.pre, news.globals, fields.item);

    app.get('/:league/news', news.pre, news.globals, news.list);
    app.get('/:league/news/:slug', news.pre, news.globals, news.item);
    app.get('/:league/tournaments/:name/news', news.pre, tournaments.globals, news.list);
    app.get('/:league/tournaments/:name/news/:slug', news.pre, tournaments.globals, news.item);

    app.get('/:league/:countries/news', news.pre, news.list);

    app.get('/:league/countries/:country', countries.item);


    app.get('/lazy/:league/recent/:name', tournaments.restRecent);
    app.get('/lazy/:league/comming/:name', tournaments.restComming);
    app.get('/lazy/:league/stats/:name', tournaments.restStats);
};
