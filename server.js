var express = require('express');
var path = require('path');
var hbs = require('hbs');
var routes = require('./app/routes');

var app = express();

// Configure server
var port = process.env.NODE_PORT || 3000;

console.log(port);

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

hbs.registerPartials(__dirname + viewsDir + '/partials');


app.use(app.router);

app.use(function (req, res, next) {
    if (req.url.substr(-1) == '/' && req.url.length > 1) {
        res.redirect(301, req.url.slice(0, -1));
    } else {
        next();
    }
});

app.get('*', function(req, res, next) {
    if (req.url === '/api') {
        return next();
    }
    var leagues = require('./models/league');
    res.locals.leagues = leagues.get();

    next();
});

//routes list:
routes.initialize(app);

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)

})
