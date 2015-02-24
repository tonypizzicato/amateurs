var mongoose     = require('mongoose'),
    RestClient  = require('node-rest-client').Client,
    LeagueModel = require('../models/league');

exports.up = function (db, next) {

    mongoose.connect('mongodb://localhost/amateur');

    LeagueModel.remove({}).exec();

    var url = 'http://82.196.6.26:443/api/leagues';

    var optionsAuth = {user: "root", password: "horseremorse"};
    var client = new RestClient(optionsAuth);

    client.get(url, function (data) {
        var parsed = JSON.parse(data);
        parsed.forEach(function (item) {
            var league = new LeagueModel(item);
            league.remoteId = item._id;
            league.save(function (err) {
                if (err) {
                    console.dir('Could not save new league. Details: ' + err);
                }
                next();
            });
        });
    });
};

exports.down = function (db, next) {
    mongoose.connect('mongodb://localhost/amateur');
    console.dir('removed++++++++++++++++++++');
    LeagueModel.remove({}, next);
};
