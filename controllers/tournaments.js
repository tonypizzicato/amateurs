'use strict';

var _               = require('underscore'),
    moment          = require('moment'),
    RestClient      = require('node-rest-client').Client,
    LeagueModel     = require('../models/league'),
    TournamentModel = require('../models/tournament'),
    ContactModel    = require('../models/contact'),
    remoteConfig    = require('../config/tinyapi'),
    Promise         = require('promise');

var client = new RestClient(remoteConfig.authOptions);

module.exports = {
    list: function (req, res, next) {
        TournamentModel.find({leagueId: req.params.leagueId}, function (err, docs) {
            if (err) {
                return next(err);
            }

            var populateOptions = {path: 'countries', options: {sort: {'sort': 1}}};
            LeagueModel.find({show: true}).sort({sort: 1}).populate(populateOptions).lean().exec(function (err, docsLeagues) {
                res.locals.globals.leagues = docsLeagues;
                res.render('tournaments/list', {tournaments: docs, pageTournaments: true});
            });

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

            client.get(remoteConfig.url + '/stats/players_stats?tournamentId=' + doc.remoteId, function (stats) {
                stats = JSON.parse(stats);

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

                res.render('tournaments/item', {tournament: doc, stats: stat});
            });
        });
    },

    table: function (req, res) {
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

    stats: function (req, res) {
        console.log('stats start');
        TournamentModel.findOne({slug: req.params.name}, function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc) {
                res.status(404);
                return next(null);
            }

            client.get(remoteConfig.url + '/stats/players_stats?tournamentId=' + doc.remoteId, function (stats) {
                stats = JSON.parse(stats);

                stats = stats.sort(function (a, b) {
                    return a.points >= b.points ? -1 : 1;
                });
                console.log('stats end');
                res.render('tournaments/stats', {tournament: doc, stats: stats});
            });
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
        var tournament;
        var populateOptions = {path: 'country'};
        TournamentModel.findOne({slug: req.params.name}).lean().populate(populateOptions).exec(function (err, doc) {
            if (err) {
                return next(err);
            }
            tournament = doc;

            /* Contacts widget data */
            var contacts = new Promise(function (resolve, reject) {
                ContactModel.find({tournaments: doc._id}).sort({sort: 1}).lean().exec(function (err, docs) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(docs);
                });
            });

            /* Leagues */
            var leagues = new Promise(function (resolve, reject) {
                var populateOptions = {path: 'countries', options: {sort: {'sort': 1}}};
                LeagueModel.find({show: true}).sort({sort: 1}).populate(populateOptions).exec(function (err, docs) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(docs);
                });
            });

            /* Table */
            var table = new Promise(function (resolve, reject) {
                client.get(remoteConfig.url + '/stats/table?tournamentId=' + doc.remoteId, function (table) {
                    table = JSON.parse(table);
                    table.temas = table.teams.map(function (item) {
                        item.form = item.form.slice(-5);
                        return item;
                    });

                    resolve(table);
                });
            });

            /* Recent/comming games widget */
            var games = new Promise(function (resolve, reject) {
                client.get(remoteConfig.url + '/games?tournamentId=' + doc.remoteId, function (games) {
                    games = JSON.parse(games);

                    games = games.map(function (item) {

                        if (item.state == 'CLOSED' && item.score) {
                            if (item.score.ft[0] > item.score.ft[1]) {
                                item.teams[0].win = true;
                                item.teams[0].loose = false;
                                item.teams[0].draw = false;
                            } else if (item.score.ft[0] < item.score.ft[1]) {
                                item.teams[0].win = false;
                                item.teams[0].loose = true;
                                item.teams[0].draw = false;
                            } else {
                                item.teams[0].win = false;
                                item.teams[0].loose = false;
                                item.teams[0].draw = true;
                            }
                        }

                        item.dateTime = item.date ? moment(item.date + ' ' + item.time, 'DD/MM/YYYY HH:mm') : null;
                        return item;
                    });

                    // TODO: replace with dateTime
                    games.sort(function (a, b) {

                        if (a.dateTime) {
                            if (a.dateTime.isBefore(b.dateTime)) {
                                return -1;
                            } else {
                                return 1;
                            }
                        } else {
                            return a.tourNumber < b.tourNumber ? -1 : 1;
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
                        return !item.dateTime || (item.dateTime && (item.dateTime.isAfter(moment()) || item.dateTime.isSame(moment())) && item.state != 'CLOSED');
                    });

                    recent = _.groupBy(recent.slice(-8), 'tourNumber');
                    comming = _.groupBy(comming.slice(0, 10), 'tourNumber');
                    resolve({recent: recent, comming: comming});
                });
            });

            Promise.all([leagues, games, table, contacts]).then(function (result) {
                res.locals.globals.tournament = tournament;
                res.locals.globals.leagues = result[0];
                res.locals.globals.recent = result[1].recent;
                res.locals.globals.comming = result[1].comming;
                res.locals.globals.table = result[2];
                res.locals.globals.contacts = result[3];

                console.log('globals end');
                next();
            });
        });
    }
};
