/**
 * Script to update tournaments with stages and actual states
 */

var mongoose         = require('mongoose');
var request          = require('request');
var LeaguesModel     = require('../models/league');
var TournamentsModel = require('../models/tournament');
var remoteConfig     = require('../config/tinyapi');
var Promise          = require('promise');

mongoose.connect('mongodb://localhost/amateur');

var promise = new Promise(function (resolve, reject) {
    LeaguesModel.find().exec(function (err, leagues) {
        if (err) {
            return reject(err);
        }

        resolve(leagues);
    });
});

promise
    .then(function (leagues) {
        var requests = [];

        leagues.forEach(function (league) {
            var url = remoteConfig.url + '/league/' + league._id + '/tournaments/active';
            console.log(url);
            requests.push(new Promise(function (resolve) {
                remote(url, function (err, res, tournaments) {
                    console.log(tournaments.length);
                    var ids = tournaments.map(function (item) {
                        return item._id
                    });
                    tournaments.forEach(function (item) {
                        TournamentsModel.findOneAndUpdate({remoteId: item._id}, {$set: {stages: item.stages, state: 'IN_PROGRESS'}}).exec();
                    });

                    TournamentsModel.update({leagueId: league._id, _id: {$nin: ids}}, {$set: {state: 'ARCHIVE'}}, {multi: true}).exec();
                    resolve(true);
                });
            }))
        });

        Promise.all(requests).then(function (res) {
            console.info('Done.', res);
            process.exit(0);
        });
    })
    .catch(function (err) {
        console.log('Error:', err.message);
        process.exit(-1);
    });


function remote(url, cb) {
    return request.get({
        uri:  url,
        auth: remoteConfig.authOptions,
        gzip: true,
        json: true
    }, cb);
}