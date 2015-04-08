'use strict';

var _                = require('underscore'),
    moment           = require('moment'),
    RestClient       = require('node-rest-client').Client,
    LeagueModel      = require('../models/league'),
    TournamentModel  = require('../models/tournament'),
    GameArticleModel = require('../models/game-article'),
    PhotoModel       = require('../models/photo'),
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
                GameArticleModel.findOne({tournament: doc.remoteId, type: 'preview', show: true, centralGame: true}).lean().exec(function (err, doc) {
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
                GameArticleModel.find({tournament: doc.remoteId, show: true}).sort({dc: 1}).limit(30).lean().exec(function (err, docs) {
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
                    tournament: doc.remoteId,
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
                    tournament: doc,
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
                            return a.game.dateTime.isBefore(b.game.dateTime) ? -1 : 1;
                        } else {
                            return -1;
                        }
                    }
                    return 1;
                });

                return docs;
            }
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

            res.render('tournaments/table', {tournament: doc, pageTable: true});
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
                stats = stats.filter(function (item) {
                    return !!item.playerId;
                });

                stats = stats.sort(function (a, b) {
                    return a.points >= b.points ? -1 : 1;
                });
                console.log('stats end');
                res.render('tournaments/stats', {tournament: doc, stats: stats, pageStats: true});
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

                res.render('tournaments/fixture', {tournament: doc, fixture: fixture, pageFixture: true});
            });
        });
    },

    globals: function (req, res, next) {
        var tournament;
        var populateCountry  = {path: 'country'};
        var populateContacts = {path: 'contacts', match: {show: true}, options: {sort: {sort: 1}}};

        TournamentModel.findOne({slug: req.params.name}).lean().populate(populateCountry).populate(populateContacts).exec(function (err, doc) {
            if (err) {
                return next(err);
            }
            tournament = doc;

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

            /* Stats */
            var stats = new Promise(function (resolve, reject) {
                client.get(remoteConfig.url + '/stats/players_stats?tournamentId=' + doc.remoteId, function (stats) {
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

                    resolve({goals: goals, assists: assists});
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
                        comming = _.values(_.groupBy(comming, 'tourNumber')).reduce(function (a, b) {
                            return a.length > b.length ? a : b;
                        });
                    }

                    recent  = _.groupBy(recent.slice(-8), 'tourNumber');
                    comming = _.groupBy(comming.slice(0, 10), 'tourNumber');

                    resolve({recent: recent, comming: comming});
                });
            });

            Promise.all([leagues, games, table, stats]).then(function (result) {
                res.locals.globals.tournament = tournament;
                res.locals.globals.leagues    = result[0];
                res.locals.globals.recent     = result[1].recent;
                res.locals.globals.comming    = result[1].comming;
                res.locals.globals.table      = result[2];
                res.locals.globals.stats      = result[3];

                console.log('globals end');
                next();
            });
        });
    }
};
