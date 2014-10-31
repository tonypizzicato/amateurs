var express = require('express');
var path = require('path');


var app = express();

// Configure server
var port = process.env.PORT || 3000;
app.set('port', port);
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'keyboard cat'}));


// Mount statics
app.use(express.static(path.join(__dirname, '../.tmp')));
app.use(express.static(path.join(__dirname, '../app')));


app.use(app.router);

app.use(function (req, res, next) {
    if (req.url.substr(-1) == '/' && req.url.length > 1) {
        res.redirect(301, req.url.slice(0, -1));
    } else {
        next();
    }
})

// Route index.html
app.get('/', function (req, res) {
    console.log('get: index');
    res.sendfile(path.join(__dirname, '../app/index.html'));
});

app.get('/nationals/promo', function (req, res) {
    console.log('get: nationals/promo');
    res.sendfile(path.join(__dirname, '../app/promo/nationals.html'));
});

var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)

})
