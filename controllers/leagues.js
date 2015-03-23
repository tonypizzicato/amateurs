'use strict';

var LeagueModel      = require('../models/league'),
    TournamentLeague = require('../models/tournament'),
    RestClient       = require('node-rest-client').Client,
    remoteConfig     = require('../config/tinyapi'),
    Promise          = require('promise');

var client = new RestClient(remoteConfig.authOptions);

module.exports = {
    item: function (req, res) {
        /* Leagues */
        var leagues = new Promise(function (resolve, reject) {
            var populateOptions = {path: 'countries', options: {sort: {'sort': 1}}};
            LeagueModel.find({show: true}).sort({sort: 1}).populate(populateOptions).exec(function (err, docs) {
                if (err) {
                    reject(err);
                }

                resolve(docs);
            });
        });

        /* League */
        var league = new Promise(function (resolve, reject) {
            var populateOptions = {path: 'countries', options: {sort: {'sort': 1}}};
            LeagueModel.findOne({slug: req.params.league}).lean().populate(populateOptions).exec(function (err, doc) {
                if (err) {
                    return next(err);
                }
                if (!doc) {
                    res.status(404);
                    return next(null);
                }

                TournamentLeague.find({leagueId: doc._id}).lean().exec(function (err, docs) {

                    var tournaments = {};
                    docs.forEach(function (item) {
                        tournaments[item.remoteId] = {};
                        client.get(remoteConfig.url + '/stats/table?tournamentId=' + item.remoteId, function (table) {
                            tournaments[item.remoteId].table = table;
                        });

                        client.get(remoteConfig.url + '/stats/table?tournamentId=' + item.remoteId, function (table) {
                            tournaments[item.remoteId].fixture = table;
                        });
                    });

                    resolve({league: doc, tournaments: tournaments});
                });

            });
        });


        Promise.all([leagues, league]).then(function (result) {
            res.locals.globals.leagues = result[0];
            res.locals.globals.league = result[1].league;

            var populateOptions = {path: 'countries.tournaments', options: {sort: {'sort': 1}}};
            LeagueModel.populate(result[1], populateOptions, function (err, doc) {
                res.render('leagues/item', {league: doc, tournaments: result[1].tournaments});
            });
        });

    }
};
