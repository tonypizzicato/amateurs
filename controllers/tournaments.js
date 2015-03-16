'use strict';

var moment          = require('moment'),
    RestClient      = require('node-rest-client').Client,
    TournamentModel = require('../models/tournament'),
    ContactModel    = require('../models/contact'),
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
        console.log('item');
        TournamentModel.findOne({slug: req.params.name}, function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc) {
                res.status(404);
                return next(null);
            }


            var client = new RestClient(remoteConfig.authOptions);
            client.get(remoteConfig.url + '/stats/players_stats?tournamentId=' + doc.remoteId, function (stats) {
                stats = JSON.parse(stats);
                console.dir(stats);

                console.log('render');

                var stat = {
                    goals:   [],
                    assists: []
                };

                stats = stats.sort(function (a, b) {
                    return a.goals >= b.goals ? -1 : 1;
                });
                stat.goals = stats.slice(0, 10);

                stats = stats.sort(function (a, b) {
                    return a.assists >= b.assists ? -1 : 1;
                });
                stat.assists = stats.slice(0, 10);

                console.dir(stat.assists);

                res.render('tournaments/item', {tournament: doc, stats: stat});
            });
        });
    },

    table: function (req, res) {
        console.log('table');
        TournamentModel.findOne({slug: req.params.name}, function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc) {
                res.status(404);
                return next(null);
            }

            res.render('tournaments/table', {tournament: doc});
        });
    },

    fixture: function (req, res) {
        console.log('fixture');
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

                res.render('tournaments/fixture', {
                    tournament: doc,
                    fixture:    fixture
                });
            });
        });
    },

    globals: function (req, res, next) {
        console.log('all');
        TournamentModel.findOne({slug: req.params.name}, function (err, doc) {
            if (err) {
                return next(err);
            }
            var client = new RestClient(remoteConfig.authOptions);


            /* Contacts widget data */
            ContactModel.find({tournaments: doc._id}).sort({sort: 1}).lean().exec(function (err, docs) {
                if (err) {
                    return next();
                }
                console.log('contacts', req.params.name);

                res.locals.globals.contacts = docs;

            });

            /* Table */
            client.get(remoteConfig.url + '/stats/table?tournamentId=' + doc.remoteId, function (table) {
                table = JSON.parse(table);
                res.locals.globals.table = table;
            });

            client.get(remoteConfig.url + '/games?tournamentId=' + doc.remoteId, function (games) {

                /* Recent/comming games widget */
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

                var recent = games.filter(function (item) {
                    return item.dateTime && item.dateTime.isBefore(moment()) && item.state == 'CLOSED';
                });
                var comming = games.filter(function (item) {
                    return item.dateTime && (item.dateTime.isAfter(moment()) || item.dateTime.isSame(moment())) && item.state != 'CLOSED';
                });

                recent = recent.slice(-7);
                comming = comming.slice(0, 7);
                res.locals.globals.recent = recent;
                res.locals.globals.comming = comming;


                next();
            });
        });
    }
};
