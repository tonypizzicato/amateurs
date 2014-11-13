var express = require('express');
var path = require('path');
var hbs = require('hbs');

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

hbs.registerPartials(__dirname + viewsDir + '/partials');


app.use(app.router);

app.use(function (req, res, next) {
    if (req.url.substr(-1) == '/' && req.url.length > 1) {
        res.redirect(301, req.url.slice(0, -1));
    } else {
        next();
    }
});

// Route index.html
app.get('/', function (req, res) {
    console.log('get: index');
    console.log('client dir: ' + clientDir);

    res.sendfile(path.join(__dirname, clientDir + '/construct.html'));
});

app.get('/nationals/promo', function (req, res) {
    console.log('get: nationals/promo');
    console.log('client dir: ' + clientDir);

    res.sendfile(path.join(__dirname, clientDir + '/promo/nationals.html'));
});

app.get('/hbs', function (req, res) {
    res.render('main');
});

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)

})
