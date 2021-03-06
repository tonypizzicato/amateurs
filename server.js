var express = require('express');
var session = require('express-session');
var path = require('path');
var hbs = require('hbs');
var helpers = require('./app/hbs-helpers');
var routes = require('./app/routes');
var mongoose = require('mongoose');

var app = express();

// Configure server
var port = process.env.NODE_PORT || 3000;

console.log(port);

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/amateur');

app.set('port', port);
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'keyboard cat'}));


var clientDir, viewsDir;
/**
 * Development Settings
 */
if (app.get('env') === 'development') {
    clientDir = '/public';
    viewsDir = '/views';

    app.use(express.static(path.join(__dirname, '.tmp')));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error:   err
        });
    });
}

/**
 * Production Settings
 */
if (app.get('env') === 'production') {
    clientDir = '/dist';
    viewsDir = '/dist/views';

    app.use(express.static(path.join(__dirname, 'dist')));

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error:   {}
        });
    });
}

app.set('view engine', 'hbs');
app.set('views', __dirname + viewsDir);
app.set('public', __dirname + clientDir);

helpers.initialize(hbs);
hbs.registerPartials(__dirname + viewsDir + '/partials');

app.use(session({
    secret:            'test secret',
    resave:            true,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    if (req.url.substr(-1) == '/' && req.url.length > 1) {
        res.redirect(301, req.url.slice(0, -1));
    } else {
        next();
    }
});

app.get('*', function (req, res, next) {
    res.locals.globals = res.locals.globals || {};

    if (req.url === '/api') {
        return next();
    }
    var leagues = require('./models/league');
    res.locals.globals.leagues = leagues.getCountries();

    next();
});

app.get('/countries/:country', function (req, res, next) {
    var contactsModel = require('./models/contact');
    var country = req.param('country', req.session.currentCountry);

    res.locals.globals.currentCountry = country;

    contactsModel.find({country: country}, function (err, contacts) {
        res.locals.globals.contactsCountry = contacts;
    });

    req.session.currentCountry = country;

    next();
});

app.get('/leagues/:name*', function (req, res, next) {
    var contactsModel = require('./models/contact');
    var fixtureModel = require('./models/fixture');
    var leagueName = req.param('name', req.session.currentLeague),
        leagues = require('./models/league').find({short: leagueName});

    if (leagues.length) {
        var league = leagues.pop();

        res.locals.globals.currentCountry = league.country;
        res.locals.globals.currentLeague = league.short;
        req.session.currentCountry = league.country;
        req.session.currentLeague = league.short;


        contactsModel.find({country: league.country}, function (err, contacts) {
            res.locals.globals.contactsCountry = contacts;
        });
        contactsModel.find({league: league.short}, function (err, contacts) {
            res.locals.globals.contactsLeague = contacts;
        });

        res.locals.globals.recent = fixtureModel.recent(league.short);
        res.locals.globals.comming = fixtureModel.comming(league.short);
    } else {
        res.status(404).send('Not found League');

        return;
    }

    next();
});

//routes list:
routes.initialize(app);

app.use(app.router);

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)

})
