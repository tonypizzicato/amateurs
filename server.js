var express = require('express');
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var hbs = require('hbs');
var mongoose = require('mongoose');
var expressMongoose = require('express-mongoose');

var passport = require('passport');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');

var morgan = require('morgan');
var helpers = require('./app/hbs-helpers');

var routes = require('./app/routes');

var app = express();

// Configure server
var port = process.env.NODE_PORT || 3000;

console.log(port);

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/amateur');

app.set('port', port);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json());

app.use(session({
    secret:            'test secret',
    resave:            true,
    saveUninitialized: true
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

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


app.use(function (req, res, next) {
    if (req.url.substr(-1) == '/' && req.url.length > 1) {
        res.redirect(301, req.url.slice(0, -1));
    } else {
        next();
    }
});

//CORS middleware
app.use('/api', function(req, res, next) {
    console.log('allowCrossDomain');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
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

app.get('/leagues/:name/*', function (req, res, next) {
    var contactsModel = require('./models/contact');
    var fixtureModel = require('./models/fixture');
    var leagueName = req.param('name', req.session.currentLeague);

    require('./models/league').find({slug: leagueName}, function (err, leagues) {
        if (leagues.length) {
            var league = leagues.pop();

            res.locals.globals.currentCountry = league.country;
            res.locals.globals.currentLeague = league.slug;
            req.session.currentCountry = league.country;
            req.session.currentLeague = league.slug;


            contactsModel.find({country: league.country}, function (err, contacts) {
                res.locals.globals.contactsCountry = contacts;
            });
            contactsModel.find({league: league.slug}, function (err, contacts) {
                res.locals.globals.contactsLeague = contacts;
            });

            res.locals.globals.recent = fixtureModel.recent(league.slug);
            res.locals.globals.comming = fixtureModel.comming(league.slug);
        } else {
            res.status(404).send('Not found League');

            return;
        }
    });

    next();
});

//routes list:
routes.initialize(app);

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)

})
