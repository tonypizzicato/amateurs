var express = require('express');
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var hbs = require('hbs');
var mongoose = require('mongoose');

var passport = require('passport');

var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');

var morgan = require('morgan');
var helpers = require('./app/hbs-helpers');

var routes = require('./app/routes');

var app = express();

var SessionMongoStore = require('connect-mongo')(session);

var LeagueModel = require('./models/league');
var CountryModel = require('./models/country');
var TournamentModel = require('./models/tournament');

// Configure server
var port = process.env.NODE_PORT || 9000;

console.log(port);

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/amateur');

app.set('port', port);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cookieParser());

app.use(busboy());
// parse application/json
app.use(bodyParser.json({limit: '5mb'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '5mb', extended: false}))

app.use(session({
    secret:            'test secret',
    resave:            false,
    name:              'ssid',
    saveUninitialized: true,
    store:             new SessionMongoStore({mongooseConnection: mongoose.connection})
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
        console.log(err);
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
app.use('/api', function (req, res, next) {
    console.log('allowCrossDomain');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Cache-Control');

    next();
});


app.get('/', function (req, res) {
    //var slug = req.session.league ? req.session.league.slug : null;
    res.redirect('/moscow');
});

app.get('*', function (req, res, next) {

    if (req.url.indexOf('/api') === 0) {
        return next();
    }

    res.locals.globals = res.locals.globals || {};

    var query = {};
    if (typeof req.params[0] == 'string') {
        var param = req.params[0].slice(1);
        var match = param.match(/^(moscow|spb)/);

        if (match && match.length >= 1) {
            query = {slug: match[1]};
        }
    }

    var populateOptions = {path: 'countries', match: {show: true}, options: {sort: {'sort': 1}}};
    LeagueModel.findOne(query).populate(populateOptions).exec(function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            res.status(404);
            return next(null);
        }

        populateOptions = {path: 'countries.tournaments', model: 'Tournament', match: {show: true}, options: {sort: {'sort': 1}}};
        LeagueModel.populate(doc, populateOptions, function (err, doc) {
            req.session.league = doc;
            res.locals.globals.league = doc;

            next();
        });
    });
});

//routes list:
routes.initialize(app);


var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)

});
