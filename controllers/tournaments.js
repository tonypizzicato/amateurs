'use strict';

var _                = require('underscore'),
    request          = require('request'),
    moment           = require('moment'),
    async            = require('async'),
    RestClient       = require('node-rest-client').Client,
    LeagueModel      = require('../models/league'),
    TournamentModel  = require('../models/tournament'),
    GameArticleModel = require('../models/game-article'),
    PhotoModel       = require('../models/photo'),
    remoteConfig     = require('../config/tinyapi'),
    Promise          = require('promise'),
    Handlebars       = require('hbs').handlebars;

var client = new RestClient(remoteConfig.authOptions);

module.exports = {
    restRecent: function (req, res, next) {
        LeagueModel.findOne({slug: req.params.league}, function (err, doc) {
            TournamentModel.findOne({slug: req.params.name, leagueId: doc._id}, function (err, doc) {
                client.get(remoteConfig.url + '/games?tournamentId=' + doc.remoteId, function (games) {
                    games = JSON.parse(games);

                    games = games.map(function (item) {
                        item.dateTime = item.date ? moment(item.date + ' ' + item.time, 'DD/MM/YYYY HH:mm') : null;
                        return item;
                    });

                    // TODO: replace with dateTime
                    games.sort(function (a, b) {
                        if (!a.dateTime && !b.dateTime) {
                            return a.tourNumber < b.tourNumber ? -1 : 1;
                        }

                        if ((a.dateTime && !b.dateTime) || (a.dateTime && b.dateTime && a.dateTime.isBefore(b.dateTime))) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });

                    var recent = games.filter(function (item) {
                        return item.dateTime && item.dateTime.isBefore(moment()) && item.state == 'CLOSED';
                    });

                    recent = _.groupBy(recent.slice(-8), 'tourNumber');

                    res.render('partials/lazy/fixture', {
                        league:     res.locals.globals.league,
                        tournament: doc,
                        fixture:    recent,
                        emptyText:  'Нет данных',
                        layout:     false
                    });
                });
            });
        });
    },

    restComming: function (req, res, next) {
        LeagueModel.findOne({slug: req.params.league}, function (err, doc) {
            TournamentModel.findOne({slug: req.params.name, leagueId: doc._id}, function (err, doc) {
                client.get(remoteConfig.url + '/games?tournamentId=' + doc.remoteId, function (games) {
                    games = JSON.parse(games);

                    games = games.map(function (item) {
                        item.dateTime = item.date ? moment(item.date + ' ' + item.time, 'DD/MM/YYYY HH:mm') : null;
                        return item;
                    });

                    // TODO: replace with dateTime
                    games.sort(function (a, b) {
                        if (!a.dateTime && !b.dateTime) {
                            return a.tourNumber < b.tourNumber ? -1 : 1;
                        }

                        if ((a.dateTime && !b.dateTime) || (a.dateTime && b.dateTime && a.dateTime.isBefore(b.dateTime))) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });

                    var comming = games.filter(function (item) {
                        if (item.teams[0].name.toLowerCase() == 'tbd' || item.teams[1].name.toLowerCase() == 'tbd') {
                            return false;
                        }
                        return !item.dateTime || (item.dateTime && item.state != 'CLOSED');
                    });


                    if (!comming.length) {
                        return res.render('partials/lazy/fixture', {
                            fixture:   {},
                            emptyText: 'Нет данных',
                            layout:    false
                        });
                    }

                    comming = comming.slice(0, 12);

                    var dated = comming.filter(function (item) {
                        return !!item.dateTime;
                    });

                    if (dated.length) {
                        comming = dated;
                    } else {
                        comming = _.values(_.groupBy(comming, 'tourNumber')).reduce(function (a, b) {
                            return a.length > b.length ? a : b;
                        });
                    }

                    comming = _.groupBy(comming.slice(0, 10), 'tourNumber');

                    res.render('partials/lazy/fixture', {
                        league:     res.locals.globals.league,
                        tournament: doc,
                        fixture:    comming,
                        emptyText:  'Нет данных',
                        layout:     false
                    });
                });
            });
        });
    },

    restStats: function (req, res, next) {
        LeagueModel.findOne({slug: req.params.league}, function (err, doc) {
            TournamentModel.findOne({slug: req.params.name, leagueId: doc._id}, function (err, doc) {
                if (err) {
                    return next(err);
                }
                if (!doc) {
                    res.status(404);
                    return next(null);
                }

                client.get(remoteConfig.url + '/stats/players_stats?tournamentId=' + doc.remoteId, function (stats) {
                    stats = JSON.parse(stats);
                    stats = stats.filter(function (item) {
                        return !!item.playerId;
                    });

                    stats = stats.sort(function (a, b) {
                        return a.points >= b.points ? -1 : 1;
                    });

                    stats = stats.slice(0, 10);

                    res.render('partials/lazy/stats', {
                        league:     res.locals.globals.league,
                        tournament: doc,
                        stats:      stats,
                        emptyText:  'Нет данных',
                        layout:     false
                    });
                });
            });
        });
    },

    item: function (req, res, next) {
        LeagueModel.findOne({slug: req.params.league}, function (err, league) {
            TournamentModel.findOne({slug: req.params.name, leagueId: league._id}, function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next(null);
                }

                var stats = new Promise(function (resolve, reject) {
                    client.get(remoteConfig.url + '/stats/players_stats?tournamentId=' + tournament.remoteId, function (stats) {
                        stats = JSON.parse(stats);

                        var stat = {
                            goals:   [],
                            assists: []
                        };

                        stats      = stats.sort(function (a, b) {
                            return a.goals >= b.goals ? -1 : 1;
                        });
                        stat.goals = stats.slice(0, 10);

                        stats        = stats.sort(function (a, b) {
                            return a.assists >= b.assists ? -1 : 1;
                        });
                        stat.assists = stats.slice(0, 10);

                        resolve(stats);
                    });
                });

                var central = new Promise(function (resolve, reject) {
                    GameArticleModel.findOne({
                        tournament:  tournament.remoteId,
                        type:        'preview',
                        show:        true,
                        centralGame: true
                    }).lean().exec(function (err, doc) {
                        if (err) {
                            return reject(err);
                        }
                        if (!doc) {
                            return resolve(null);
                        }

                        client.get(remoteConfig.url + '/games/' + doc.gameId, function (game) {
                            doc.game = JSON.parse(game);

                            doc.game.dateTime = doc.game.date ? moment(doc.game.date + ' ' + doc.game.time, 'DD/MM/YYYY HH:mm') : null;

                            resolve(doc);
                        });
                    });
                });

                var articles = new Promise(function (resolve, reject) {
                    GameArticleModel.find({tournament: tournament.remoteId, show: true}).sort({dc: -1}).limit(30).lean().exec(function (err,
                                                                                                                                        docs) {
                        if (err) {
                            return reject(err);
                        }

                        if (!docs.length) {
                            return resolve({previews: [], reviews: []});
                        }

                        var games = docs.map(function (item) {
                            return 'gameIds[]=' + item.gameId;
                        });

                        client.get(remoteConfig.url + '/games?' + games.join('&'), function (games) {
                            games = JSON.parse(games);

                            var previews = prepareArticles('preview', games, docs.slice());
                            var reviews  = prepareArticles('review', games, docs.slice());

                            resolve({previews: previews, reviews: reviews});
                        });


                    })
                });

                var photos = new Promise(function (resolve, reject) {
                    var date = moment().subtract(7, 'days').format('YYYY-MM-DD');
                    PhotoModel.find({
                        tournament: tournament.remoteId,
                        type:       'games',
                        main:       {'$ne': null},
                        dc:         {$gte: date}
                    }).sort({sort: 1}).exec(function (err, docs) {
                        if (err) {
                            return reject(err);
                        }

                        if (!docs.length) {
                            return resolve([]);
                        }

                        docs = _.filter(docs, function (item) {
                            return !!item.main && !!item.main.src;
                        });

                        if (!docs.length) {
                            return resolve([]);
                        }

                        docs = _.groupBy(docs, function (item) {
                            return item.postId;
                        });

                        var ids = _.keys(docs).map(function (item) {
                            return 'gameIds[]=' + item;
                        });

                        for (var game in docs) {
                            docs[game] = docs[game];
                        }

                        client.get(remoteConfig.url + '/games?' + ids.join('&'), function (games) {
                            games = JSON.parse(games);

                            var res = [];

                            games.forEach(function (item) {
                                res.push({
                                    game:   item,
                                    photos: docs[item._id].slice(0, 5)
                                })
                            });

                            resolve(res);
                        });
                    });
                });

                Promise.all([stats, central, articles, photos]).then(function (result) {
                    res.render('tournaments/item', {
                        tournament: tournament,
                        stats:      result[0],
                        central:    result[1],
                        previews:   result[2].previews,
                        reviews:    result[2].reviews,
                        photos:     result[3]
                    });
                });

                function prepareArticles(type, games, docs) {
                    var comparator;
                    if (type == 'preview') {
                        comparator = function (item) {
                            return item.state.toLowerCase() != 'closed';
                        };
                    } else {
                        comparator = function (item) {
                            return item.state.toLowerCase() == 'closed';
                        };
                    }
                    games = games.filter(comparator);

                    games.forEach(function (item) {
                        var article = docs.filter(function (doc) {
                            return doc.gameId == item._id && doc.type == type;
                        }).pop();
                        if (!article) {
                            return;
                        }

                        article.game = item;
                    });

                    docs = docs.filter(function (item) {
                        return !!item.game;
                    });

                    var grouped = _.groupBy(docs, function (item) {
                        return item.gameId;
                    });

                    docs = _.flatten(
                        _.values(grouped).filter(function (item) {
                            return item.length == 1 && item[0].type == type;
                        })
                    );

                    docs.forEach(function (item) {
                        item.game.dateTime = item.game.date ? moment(item.game.date + ' ' + item.game.time, 'DD/MM/YYYY HH:mm') : null;
                    });

                    docs = docs.sort(function (a, b) {
                        if (a.game.dateTime) {
                            if (b.game.dateTime) {
                                return a.game.dateTime.isBefore(b.game.dateTime) ? 1 : -1;
                            } else {
                                return -1;
                            }
                        }
                        return -1;
                    });

                    return docs;
                }
            });
        });

    },

    table: function (req, res) {
        LeagueModel.findOne({slug: req.params.league}, function (err, league) {
            TournamentModel.findOne({slug: req.params.name, leagueId: league._id}, function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next(null);
                }

                res.render('tournaments/table', {tournament: tournament, pageTable: true});
            });
        });
    },

    stats: function (req, res) {
        LeagueModel.findOne({slug: req.params.league}, function (err, league) {
            TournamentModel.findOne({slug: req.params.name, leagueId: league._id}, function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next(null);
                }

                client.get(remoteConfig.url + '/stats/players_stats?tournamentId=' + tournament.remoteId, function (stats) {
                    stats = JSON.parse(stats);
                    stats = stats.filter(function (item) {
                        return !!item.playerId;
                    });

                    stats = stats.sort(function (a, b) {
                        return a.points >= b.points ? -1 : 1;
                    });
                    log('stats end');
                    res.render('tournaments/stats', {tournament: tournament, stats: stats, pageStats: true});
                });
            });
        });
    },

    fixture: function (req, res) {
        LeagueModel.findOne({slug: req.params.league}, function (err, league) {
            TournamentModel.findOne({slug: req.params.name, leagueId: league._id}, function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next(null);
                }

                client.get(remoteConfig.url + '/games?tournamentId=' + tournament.remoteId, function (games) {
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

                    res.render('tournaments/fixture', {tournament: tournament, fixture: fixture, pageFixture: true});
                });
            });
        });
    },

    globals: function (req, res, next) {
        var populateCountry  = {path: 'country'};
        var populateContacts = {path: 'contacts', match: {show: true}, options: {sort: {sort: 1}}};
        var series           = [];

        var glbsStartTime = new Date().getTime();

        /** Get league if defined in request */
        if (req.params.league) {
            series = series.concat(function (cb) {
                LeagueModel.findOne({slug: req.params.league}).lean().exec(cb);
            });
        }

        /** Get tournament if defined in request */
        series = series.concat(function (league, cb) {
            var query = {slug: req.params.name};

            if (typeof(league) === 'function') {
                cb = league;
            } else {
                query.leagueId = league._id;
            }

            TournamentModel.findOne(query).lean().populate(populateCountry).populate(populateContacts).exec(cb);
        });

        async.waterfall(series, function (err, result) {
            if (err) {
                return next(err);
            }

            var tournament = result,
                parallels  = [];


            /* Leagues */
            parallels = parallels.concat(function (cb) {
                var populateOptions = {path: 'countries', match: {show: true}, options: {sort: {'sort': 1}}};
                LeagueModel.find({show: true}).sort({sort: 1}).populate(populateOptions).exec(cb);
            });

            /* Table */
            parallels = parallels.concat(function (cb) {
                var startTime = new Date().getTime();

                request.get({
                    uri:  remoteConfig.url + '/stats/table?tournamentId=' + tournament.remoteId,
                    auth: remoteConfig.authOptions,
                    gzip: true
                }, function (err, response) {
                    var endTime = new Date().getTime();
                    log('received Table', (endTime - startTime) + "ms.", response.body.length);

                    var table = JSON.parse(response.body);

                    table.temas = table.teams.map(function (item) {
                        item.form = item.form.slice(-5);
                        return item;
                    });

                    endTime = new Date().getTime();
                    log('processed Table', (endTime - startTime) + "ms.");

                    cb(null, table);
                });
            });

            /* Stats */
            parallels = parallels.concat(function (cb) {
                var startTime = new Date().getTime();

                client.get(remoteConfig.url + '/stats/players_stats?tournamentId=' + tournament.remoteId,
                    {headers: {"Accept-Encoding": "gzip, deflate"}}, function (stats) {

                        var endTime = new Date().getTime();
                        log('received Stats', (endTime - startTime) + "ms.", stats.length);

                        stats = JSON.parse(stats);
                        stats = stats.filter(function (item) {
                            return !!item.playerId;
                        });

                        var goals = stats.sort(function (a, b) {
                            return a.goals >= b.goals ? -1 : 1;
                        }).slice(0, 10);

                        var assists = stats.sort(function (a, b) {
                            return a.assists >= b.assists ? -1 : 1;
                        }).slice(0, 10);

                        endTime = new Date().getTime();
                        log('processed Stats', (endTime - startTime) + "ms.");

                        cb(null, {goals: goals, assists: assists});
                    });
            });

            /* Recent/comming games widget */
            parallels = parallels.concat(function (cb) {
                var startTime = new Date().getTime();

                client.get(remoteConfig.url + '/games?tournamentId=' + tournament.remoteId, function (games) {

                    var endTime = new Date().getTime();
                    log('received Games', (endTime - startTime) + "ms.", games.length);

                    games = JSON.parse(games);

                    games = games.map(function (item) {
                        item.dateTime = item.date ? moment(item.date + ' ' + item.time, 'DD/MM/YYYY HH:mm') : null;
                        return item;
                    });

                    // TODO: replace with dateTime
                    games.sort(function (a, b) {
                        if (!a.dateTime && !b.dateTime) {
                            return a.tourNumber < b.tourNumber ? -1 : 1;
                        }

                        if ((a.dateTime && !b.dateTime) || (a.dateTime && b.dateTime && a.dateTime.isBefore(b.dateTime))) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });

                    var recent = games.filter(function (item) {
                        return item.dateTime && item.dateTime.isBefore(moment()) && item.state == 'CLOSED';
                    });

                    var comming = games.filter(function (item) {
                        if (item.teams[0].name.toLowerCase() == 'tbd' || item.teams[1].name.toLowerCase() == 'tbd') {
                            return false;
                        }
                        return !item.dateTime || (item.dateTime && item.state != 'CLOSED');
                    });

                    comming = comming.slice(0, 12);

                    var dated = comming.filter(function (item) {
                        return !!item.dateTime;
                    });

                    if (dated.length) {
                        comming = dated;
                    } else {
                        if (comming.length) {
                            comming = _.values(_.groupBy(comming, 'tourNumber')).reduce(function (a, b) {
                                return a.length > b.length ? a : b;
                            });
                        } else {
                            comming = [];
                        }
                    }

                    recent  = _.groupBy(recent.slice(-8), 'tourNumber');
                    comming = _.groupBy(comming.slice(0, 10), 'tourNumber');

                    endTime = new Date().getTime();
                    log('processed Games', (endTime - startTime) + "ms.");

                    cb(null, {recent: recent, comming: comming});
                });
            });

            async.parallel(parallels, function (err, result) {

                var endTime = new Date().getTime();
                log('in parallel', (endTime - glbsStartTime) + "ms.");

                res.locals.globals.tournament = tournament;
                res.locals.globals.leagues    = result[0];
                res.locals.globals.table      = result[1];
                res.locals.globals.stats      = result[2];
                res.locals.globals.recent     = result[3].recent;
                res.locals.globals.comming    = result[3].comming;

                next();
            });
        });
    }
};


function log(log) {
    var args = Array.prototype.slice.call(arguments, 0);
    args     = Array.prototype.concat.call([moment().format('HH:mm:ss:SSS')], args);
    return console.log.apply(null, args);
}
