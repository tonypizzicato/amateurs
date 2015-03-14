'use strict';

var moment          = require('moment'),
    RestClient      = require('node-rest-client').Client,
    TournamentModel = require('../models/tournament'),
    remoteConfig    = require('../config/tinyapi');

module.exports = {
    list: function (req, res, next) {
        TournamentModel.find({slug: req.params.name}, function (err, docs) {
            if (err) {
                return next(err);
            }
            res.render('tournaments/list', {tournaments: docs, pageTournaments: true});
        });
    },

    item: function (req, res, next) {
        TournamentModel.findOne({slug: req.params.name}, function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc) {
                res.status(404);
                return next(null);
            }

            var client = new RestClient(remoteConfig.authOptions);

            client.get(remoteConfig.url + '/tournaments/' + doc.remoteId, function (tournament) {
                tournament = JSON.parse(tournament);
                client.get(remoteConfig.url + '/games?tournamentId=' + doc.remoteId, function (games) {
                    games = JSON.parse(games);
                    console.dir(games);

                    res.render('tournaments/item', {tournament: tournament, games: games, tableFull: false});
                });
            });
        });
    },

    table: function (req, res) {
        var leagueName = req.param('name'),
            league = TournamentModel.get(leagueName);


        league.then(function (leagues) {
            if (!leagues.length) {
                res.status(404).send('Not found League');

                return;
            }

            res.render('table', {league: leagues.pop().toObject(), tableFull: true});
        });
    },

    fixture: function (req, res) {
        TournamentModel.findOne({slug: req.params.name}, function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc) {
                res.status(404);
                return next(null);
            }

            var client = new RestClient(remoteConfig.authOptions);

            client.get(remoteConfig.url + '/games?tournamentId=' + doc.remoteId, function (games) {
                games = JSON.parse(games);

                games = games.map(function (item) {
                    item.dateTime = item.date ? moment(item.date + ' ' + item.time, 'DD/MM/YYYY HH:mm') : null;
                    return item;
                });

                // TODO: replace with dateTime
                games.sort(function (a, b) {
                    if (a.dateTime && a.dateTime.isBefore(b.dateTime)) {
                        return -1;
                    } else {
                        return 1;
                    }
                });

                var sortedGames = games.slice(0);
                sortedGames.sort(function (a, b) {
                    if (a.tourNumber < b.tourNumber) {
                        return -1;
                    } else if (a.dateTime && a.dateTime.isBefore(b.dateTime)) {
                        return -1;
                    } else {
                        return 1;
                    }
                });

                var fixture = {};
                sortedGames.forEach(function (item) {
                    if (Object.prototype.toString.call(fixture[item.tourNumber]) !== '[object Array]') {
                        fixture[item.tourNumber] = [];
                    }
                    if (!item.dateTime) {
                        console.log('no datetime', item._id, item.dateTime, item.date);
                    }
                    fixture[item.tourNumber].push(item);
                });

                var recent = games.filter(function (item) {
                    return item.dateTime.isBefore(moment()) && item.state == 'CLOSED';
                });
                var comming = games.filter(function (item) {
                    return (item.dateTime.isAfter(moment()) || item.dateTime.isSame(moment())) && item.state != 'CLOSED';
                });

                recent = recent.slice(-7);
                comming = comming.slice(0, 7);
                res.locals.globals.recent = recent;
                res.locals.globals.comming = comming;

                res.render('tournaments/fixture', {
                    tournament: doc,
                    fixture:    fixture
                });
            });
        });
    }
};
