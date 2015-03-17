"use strict";

var moment          = require('moment'),
    RestClient      = require('node-rest-client').Client,
    TournamentModel = require('../models/tournament'),
    remoteConfig    = require('../config/tinyapi');

module.exports = {
    item: function (req, res, next) {
        TournamentModel.findOne({slug: req.params.name, show: true}).lean().exec(function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc) {
                res.status(404);
                return next();
            }

            var client = new RestClient(remoteConfig.authOptions);
            client.get(remoteConfig.url + '/teams?leagueId=' + req.params.league, function (teams) {
                teams = JSON.parse(teams);
                teams = teams.filter(function (item) {
                    return item.tournamentId = req.params.doc._id;
                });

                res.render('games/item', {tournament: doc, game: teams});
            });
        });
    }
};
