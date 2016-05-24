"use strict";

var express          = require('express'),
    multer           = require('multer'),

    auth             = require('../controllers/auth'),
    leagues          = require('../controllers/leagues'),
    tournaments      = require('../controllers/tournaments'),
    games            = require('../controllers/games'),
    fields           = require('../controllers/fields'),
    contacts         = require('../controllers/contacts'),
    teams            = require('../controllers/teams'),
    news             = require('../controllers/news'),
    orders           = require('../controllers/orders'),
    stuff            = require('../controllers/stuff'),
    promo            = require('../controllers/promo'),

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
    apiOrders        = require('../controllers/api/orders'),
    apiUsers         = require('../controllers/api/users');

function t(title) {
    return function (req, res, next) {
        res.locals.title = title;
        next();
    }
}

var upload  = multer({ dest: __dirname + '/../public/uploads/' });

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
        .post(upload.any(), apiPhotos.create);

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

    r.route('/users/:id')
        .put(apiUsers.save);

    apiRouter.use(r);

    app.use('/api', apiRouter);


    app.get('/about', t('О Лиге'), function (req, res) {
        res.render('static/about', { pageAbout: true });
    });

    app.get('/login', auth.loginPage);
    app.get('/account', auth.account);
    app.post('/login', auth.login);
    app.post('/logout', auth.logout);

    app.post('/orders', orders.create);


    /** Delete after 1 month */
    app.get('/:league/tournaments/promo/vdv-day', t(''), promo.vdv);

    app.get('/:league/tournaments/:name/fixture', t(''), news.pre, tournaments.globals, tournaments.fixture);
    app.get('/:league/tournaments/:name/table', t(''), news.pre, tournaments.globals, tournaments.table);
    app.get('/:league/tournaments/:name/matches/:id', t(''), news.pre, tournaments.globals, games.item);
    app.get('/:league/tournaments/:name/stats', t(''), news.pre, tournaments.globals, tournaments.stats);
    app.get('/:league/tournaments/:name/teams/', t(''), news.pre, tournaments.globals, teams.list);
    app.get('/:league/tournaments/:name/teams/:id', t(''), news.pre, tournaments.globals, teams.item);
    app.get('/:league/tournaments/:name/fields/', t('Поля'), news.pre, tournaments.globals, fields.list);
    app.get('/:league/tournaments/:name/fields/:fieldName', t(''), news.pre, tournaments.globals, fields.item);
    app.get('/:league/tournaments/:name', t('Чемпионат'), news.pre, tournaments.globals, tournaments.item);

    app.get('/:league(moscow|spb|ekb|kazan|y-ola|rostov|anapa|izhevsk|kiev)', t('Турниры'), news.pre, leagues.item);

    app.get('/:league/contacts', t('Контакты'), news.pre, news.globals, contacts.list);
    app.get('/:league/fields', t('Поля'), news.pre, news.globals, fields.list);
    app.get('/:league/fields/:fieldName', t(''), news.pre, news.globals, fields.item);
    app.get('/:league/stuff', t('Сотрудники лиги'), news.pre, news.globals, stuff.list);
    app.get('/:league/bosses', t('Руководители лиги'), news.pre, news.globals, stuff.bosses);

    app.get('/:league/news', t('Новости'), news.pre, news.globals, news.list);
    app.get('/:league/news/:slug', t('Новости'), news.pre, news.globals, news.item);
    app.get('/:league/tournaments/:name/news', t('Новости'), news.pre, tournaments.globals, news.list);
    app.get('/:league/tournaments/:name/news/:slug', t('Новости'), news.pre, tournaments.globals, news.item);

    app.get('/lazy/:league/recent/:name', tournaments.restRecent);
    app.get('/lazy/:league/comming/:name', tournaments.restComming);
    app.get('/lazy/:league/stats/:name', tournaments.restStats);
};
