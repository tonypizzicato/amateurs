'use strict';

var _                = require('underscore'),
    moment           = require('moment'),
    RestClient       = require('node-rest-client').Client,
    LeagueModel      = require('../models/league'),
    TournamentModel  = require('../models/tournament'),
    GameArticleModel = require('../models/game-article'),
    remoteConfig     = require('../config/tinyapi'),
    Promise          = require('promise');

var client = new RestClient(remoteConfig.authOptions);

module.exports = {
    list: function (req, res, next) {
        TournamentModel.find({leagueId: req.params.leagueId}, function (err, docs) {
            if (err) {
                return next(err);
            }

            var populateOptions = {path: 'countries', match: {show: true}, options: {sort: {'sort': 1}}};
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

            var stats = new Promise(function (resolve, reject) {
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

                    resolve(stats);
                });

                var central = new Promise(function (resolve, reject) {
                    GameArticleModel.findOne({tournament: doc.remoteId, type: 'preview'}).lean().exec(function (err, doc) {
                        if (err) {
                            reject(err);
                        }

                        client.get(remoteConfig.url + '/games/' + doc.gameId, function (game) {
                            doc.game = JSON.parse(game);

                            doc.game.dateTime = doc.game.date ? moment(doc.game.date + ' ' + doc.game.time, 'DD/MM/YYYY HH:mm') : null;

                            resolve(doc);
                        });
                    });
                });

                Promise.all([stats, central]).then(function (result) {
                    res.render('tournaments/item', {tournament: doc, stats: result[0], central: result[1]});
                });
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
                    } else if ((a.dateTime && !b.dateTime) || (a.dateTime && b.dateTime && a.dateTime.isBefore(b.dateTime))) {
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
                        //console.log('no datetime', item._id, item.dateTime, item.date);
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
        var populateCountry = {path: 'country'};
        var populateContacts = {path: 'contacts', options: {sort: {sort: 1}}};
        TournamentModel.findOne({slug: req.params.name}).lean().populate(populateCountry).populate(populateContacts).exec(function (err, doc) {
            if (err) {
                return next(err);
            }
            tournament = doc;
            console.log(doc.contacts);

            /* Leagues */
            var leagues = new Promise(function (resolve, reject) {
                var populateOptions = {path: 'countries', match: {show: true}, options: {sort: {'sort': 1}}};
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
                        item.dateTime = item.date ? moment(item.date + ' ' + item.time, 'DD/MM/YYYY HH:mm') : null;
                        return item;
                    });

                    // TODO: replace with dateTime
                    games.sort(function (a, b) {
                        if (a.tourNumber < b.tourNumber) {
                            return -1;
                        } else if ((a.dateTime && !b.dateTime) || (a.dateTime && b.dateTime && a.dateTime.isBefore(b.dateTime))) {
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
                        return !item.dateTime || (item.dateTime && (item.dateTime.isAfter(moment()) || item.dateTime.isSame(moment())) && item.state != 'CLOSED');
                    });

                    recent = _.groupBy(recent.slice(-8), 'tourNumber');
                    comming = _.groupBy(comming.slice(0, 10), 'tourNumber');

                    resolve({recent: recent, comming: comming});
                });
            });

            Promise.all([leagues, games, table]).then(function (result) {
                res.locals.globals.tournament = tournament;
                res.locals.globals.leagues = result[0];
                res.locals.globals.recent = result[1].recent;
                res.locals.globals.comming = result[1].comming;
                res.locals.globals.table = result[2];

                console.log('globals end');
                next();
            });
        });
    }
};
