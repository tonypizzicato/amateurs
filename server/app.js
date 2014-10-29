var express = require('express');
var path = require('path');


var app = express();

// Configure server
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'keyboard cat'}));


// Mount statics
app.use(express.static(path.join(__dirname, '../.tmp')));
app.use(express.static(path.join(__dirname, '../app')));


app.use(app.router);

// Route index.html
app.get('/', function (req, res) {
    console.log('get: index');
    res.sendfile(path.join(__dirname, '../app/index.html'));
});

var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)

})
