'use strict';

var _                = require('lodash'),
    moment           = require('moment'),
    async            = require('async'),
    LeagueModel      = require('../models/league'),
    TournamentModel  = require('../models/tournament'),
    GameArticleModel = require('../models/game-article'),
    PhotoModel       = require('../models/photo'),
    Promise          = require('promise'),
    Handlebars       = require('hbs').handlebars;

import request from '../utils/request';

const playerFieldsToSum = [
    'played',
    'goals',
    'assists',
    'goals_assists',
    'hearts',
    'stars',
    'hearts_stars',
    'goals_assists_hearts_stars',
    'penGoals',
    'fkGoals',
    'noAssistGoals',
    'assistGoals',
    'yellowCards',
    'redCards'
];


const sumStats = stats => {
    const result = {};

    stats.forEach(player => {
        if (result.hasOwnProperty(player.playerId)) {
            var summed = playerFieldsToSum.reduce((player, field) => _.merge(player, { [field]: player[field] + result[player.playerId][field]}), player);

            player     = {
                ...player,
                ...summed
            }
        }

        result[player.playerId] = player;
    });

    return _.values(result);
};


module.exports = {
    restRecent: function (req, res, next) {
        LeagueModel.findOne({ slug: req.params.league }, function (err, doc) {
            TournamentModel.findOne({ slug: req.params.name, leagueId: doc._id }, function (err, tournament) {

                if (!tournament.stages || !tournament.stages.length) {
                    return res.render('partials/lazy/fixture', {
                        fixture:   {},
                        emptyText: 'Нет данных',
                        layout:    false
                    });
                }

                //if (tournament.stages.length == 1) {
                request(`/tournaments/games?ids=${tournament._id}`)
                    .then(response => {
                        var games = response.data.map(function (item) {
                            item.dateTime = item.timestamp ? moment.unix(item.timestamp) : null;
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

                        recent = _.groupBy(recent.slice(-8), 'tourText');

                        res.render('partials/lazy/fixture', {
                            league:     res.locals.globals.league,
                            tournament: tournament,
                            fixture:    recent,
                            emptyText:  'Нет данных',
                            layout:     false
                        });
                    });
                //}
            });
        });
    },

    restComming: function (req, res, next) {
        LeagueModel.findOne({ slug: req.params.league }, function (err, doc) {
            TournamentModel.findOne({ slug: req.params.name, leagueId: doc._id }, function (err, tournament) {

                if (!tournament.stages || !tournament.stages.length) {
                    return res.render('partials/lazy/fixture', {
                        fixture:   {},
                        emptyText: 'Нет данных',
                        layout:    false
                    });
                }

                request(`/tournaments/games?ids=${tournament._id}`)
                    .then(response => {
                        var games = response.data.map(function (item) {
                            item.dateTime = item.timestamp ? moment.unix(item.timestamp) : null;
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
                            comming = _.first(_.values(_.groupBy(comming, 'tourText')));
                        }

                        comming = _.groupBy(comming.slice(0, 10), 'tourText');

                        res.render('partials/lazy/fixture', {
                            league:     res.locals.globals.league,
                            tournament: tournament,
                            fixture:    comming,
                            emptyText:  'Нет данных',
                            layout:     false
                        });
                    });
            });
        });
    },

    restStats: function (req, res, next) {
        LeagueModel.findOne({ slug: req.params.league }, function (err, doc) {
            TournamentModel.findOne({ slug: req.params.name, leagueId: doc._id }, function (err, tournament) {

                if (!tournament.stages || !tournament.stages.length) {
                    return res.render('partials/lazy/stats', {
                        stats:     {},
                        emptyText: 'Нет данных',
                        layout:    false
                    });
                }


                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next(null);
                }

                request(`/tournaments/players?ids=${tournament._id}`)
                    .then(response => {
                        let stats = response.data.filter(item => !!item.playerId);

                        stats = sumStats(stats);
                        stats = stats
                            .sort((a, b) => a.goals_assists_hearts_stars >= b.goals_assists_hearts_stars ? -1 : 1)
                            .slice(0, 10);

                        res.render('partials/lazy/stats', {
                            league:    res.locals.globals.league,
                                       tournament,
                                       stats,
                            emptyText: 'Нет данных',
                            layout:    false
                        });
                    });
            });
        });
    },

    item: function (req, res, next) {
        LeagueModel.findOne({ slug: req.params.league }, function (err, league) {
            TournamentModel.findOne({ slug: req.params.name, leagueId: league._id }, function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next(null);
                }

                var stages = new Promise(function (resolve, reject) {
                    var playOff = _.find(tournament.stages, { format: 'CUP' });

                    if (playOff) {

                        var stageNames = _.range(0, 10).map(function (i) {
                            return Math.pow(2, i);
                        }).reverse().map(function (stage) {
                            if (stage == 1) return 'финал';
                            if (stage == 2) return 'полуфинал';
                            return '1/' + stage + ' финала';
                        });

                        var stages = {};

                        stageNames.forEach(function (stage) {
                            stages[stage] = undefined;
                        });

                        request(`/tournaments/games?ids=${tournament._id}`)
                            .then(response => {
                                var games = response.data
                                    .filter(game => game.stageId == playOff._id)
                                    .map(game => {
                                        game.dateTime = game.timestamp ? moment.unix(game.timestamp) : null;
                                        return game;
                                    });

                                games = _.groupBy(games, 'tourText');

                                var gamesDoubled = {};

                                Object.keys(games).forEach(function (stageName) {
                                    gamesDoubled[stageName] = [];

                                    games[stageName].forEach(function (game) {
                                        var doubled = _.find(gamesDoubled[stageName], function (gamesDoubled) {
                                            return gamesDoubled[0].teams[0]._id == game.teams[0]._id || gamesDoubled[0].teams[0]._id == game.teams[1]._id;
                                        });

                                        if (doubled) {
                                            if (doubled[0].dateTime && game.dateTime) {
                                                if (doubled[0].dateTime < game.datetime) {
                                                    doubled.push(game);
                                                } else {
                                                    doubled.unshift(game);
                                                }
                                            } else if (doubled[0].dateTime && !game.dateTime) {
                                                doubled.push(game);
                                            } else {
                                                doubled.unshift(game);
                                            }
                                        } else {
                                            gamesDoubled[stageName].push([game]);
                                        }
                                    });
                                });

                                var right      = false;
                                var keys       = Object.keys(stages);
                                playOff.stages = {};

                                keys.forEach(function (stage) {
                                    if (!_.isUndefined(gamesDoubled[stage]) || right) {
                                        right = true;
                                        if (!_.isUndefined(gamesDoubled[stage])) {
                                            playOff.stages[stage] = gamesDoubled[stage]
                                        } else {
                                            playOff.stages[stage] = [];
                                            _.range(0, Math.pow(2, keys.length - keys.indexOf(stage) - 1)).forEach(function () {
                                                playOff.stages[stage].push([{
                                                    tourText: stage,
                                                    teams:    [{ name: "Не определено" }, { name: "Не определено" }]
                                                }]);
                                            });

                                        }
                                    }
                                });

                                resolve({ stages: tournament.stages, playOff: playOff });
                            });
                    } else {
                        resolve({ stages: tournament.stages, playOff: null });
                    }
                });

                var central = new Promise(function (resolve, reject) {
                    GameArticleModel.findOne({
                        tournament:  tournament.remoteId,
                        type:        'preview',
                        show:        true,
                        centralGame: true
                    }).sort({ dc: -1 }).lean().exec(function (err, article) {
                        if (err) {
                            return reject(err);
                        }
                        if (!article) {
                            return resolve(null);
                        }

                        request(`/games/${article.gameId}`)
                            .then(response => {
                                article.game          = response.data;
                                article.game.dateTime = article.game.timestamp ? moment.unix(article.game.timestamp) : null;

                                resolve(article);
                            });
                    });
                });

                var articles = new Promise(function (resolve, reject) {
                    GameArticleModel.find({ tournament: tournament.remoteId, show: true }).sort({ dc: -1 }).limit(30).lean().exec(function (err, docs) {
                        if (err) {
                            return reject(err);
                        }

                        if (!docs.length) {
                            return resolve({ previews: [], reviews: [] });
                        }

                        var games = docs.map(function (item) {
                            return item.gameId;
                        });

                        request(`/games?ids=${games.join('&ids=')}`)
                            .then(response => {
                                var previews = prepareArticles('preview', response.data, docs.slice());
                                var reviews  = prepareArticles('review', response.data, docs.slice());

                                resolve({ previews, reviews });
                            });
                    })
                });

                var photos = new Promise(function (resolve, reject) {
                    var date = moment().subtract(7, 'days');
                    PhotoModel.find({
                        tournament: tournament.remoteId,
                        type:       'games',
                        main:       { '$ne': null },
                        dc:         { $gte: date }
                    }).sort({ sort: 1 }).exec(function (err, docs) {
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

                        docs = _.groupBy(docs, item => item.postId);

                        const ids = _.keys(docs);

                        request(`/games?ids=${ids.join('&ids=')}`)
                            .then(response => {
                                const res = [];

                                const games = _.sortBy(response.data, 'timestamp');

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

                Promise.all([central, articles, photos, stages]).then(function (result) {
                    var showCup  = result[3].playOff && Object.keys(result[3].playOff.stages).length;
                    var template = (showCup ? 'tournaments/cup' : 'tournaments/item');

                    res.render(template, {
                        tournament:     tournament,
                        central:        result[0],
                        previews:       result[1].previews,
                        reviews:        result[1].reviews,
                        photos:         result[2],
                        stages:         result[3].stages,
                        playOff:        result[3].playOff,
                        pageTournament: true
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
                        return !!item.game && item.type == type;
                    });

                    // var grouped = _.groupBy(docs, function (item) {
                    //     return item.gameId;
                    // });
                    //
                    // docs = _.flatten(
                    //     _.values(grouped).filter(function (item) {
                    //         return item.length == 1 && item[0].type == type;
                    //     })
                    // );

                    docs.forEach(function (item) {
                        item.game.dateTime = item.game.timestamp ? moment.unix(item.game.timestamp) : null;
                    });

                    var week = moment().subtract(7, 'days');

                    docs = docs.filter(function (item) {
                        return moment(item.dc).isAfter(week);
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
        LeagueModel.findOne({ slug: req.params.league }, function (err, league) {
            TournamentModel.findOne({ slug: req.params.name, leagueId: league._id }, function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next(null);
                }

                res.title('Турнирная Таблица');
                res.render('tournaments/table', { tournament: tournament, pageTable: true });
            });
        });
    },

    stats: function (req, res) {
        LeagueModel.findOne({ slug: req.params.league }, function (err, league) {
            TournamentModel.findOne({ slug: req.params.name, leagueId: league._id }, function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next(null);
                }

                request(`/tournaments/players?ids=${tournament._id}`)
                    .then(response => {
                        let stats = response.data.filter(item => !!item.playerId);

                        stats = sumStats(stats);
                        stats = stats.sort((a, b) => a.goals_assists_hearts_stars >= b.goals_assists_hearts_stars ? -1 : 1);

                        res.title('Статистика');
                        res.render('tournaments/stats', { tournament: tournament, stats: stats, pageStats: true });
                    });
            });
        });
    },

    fixture: function (req, res) {
        LeagueModel.findOne({ slug: req.params.league }, function (err, league) {
            TournamentModel.findOne({ slug: req.params.name, leagueId: league._id }, function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next(null);
                }

                request(`/tournaments/games?ids=${tournament._id}`)
                    .then(response => {
                        const games = response.data
                            .map(game => {
                                game.dateTime = game.timestamp ? moment.unix(game.timestamp) : null;

                                return game;
                            }).sort((a, b) => {
                                if (a.tourNumber < b.tourNumber) {
                                    return -1;
                                } else if (a.tourNumber > b.tourNumber) {
                                    return 1;
                                } else if ((a.dateTime && !b.dateTime) || (a.dateTime && b.dateTime && a.dateTime.isBefore(b.dateTime))) {
                                    return -1;
                                } else {
                                    return 1;
                                }
                            });

                        var fixture = {};
                        games.forEach(function (item) {
                            if (Object.prototype.toString.call(fixture[item.tourText]) !== '[object Array]') {
                                fixture[item.tourText] = [];
                            }
                            fixture[item.tourText].push(item);
                        });

                        res.title('Календарь');
                        res.render('tournaments/fixture', { tournament: tournament, fixture: fixture, pageFixture: true });
                    });
            });
        });
    },

    globals: function (req, res, next) {
        var populateCountry  = { path: 'country' };
        var populateContacts = { path: 'contacts', match: { show: true }, options: { sort: { sort: 1 } } };
        var series           = [];

        var glbsStartTime = new Date().getTime();

        /** Get league if defined in request */
        if (req.params.league) {
            series = series.concat(function (cb) {
                LeagueModel.findOne({ slug: req.params.league }).lean().exec(cb);
            });
        }

        /** Get tournament if defined in request */
        series = series.concat(function (league, cb) {
            var query = { slug: req.params.name };

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

            if (!result) {
                return res.status(404).render('404');
            }

            var tournament = result,
                parallels  = [];

            /* Leagues */
            parallels = parallels.concat(function (cb) {
                var populateOptions = { path: 'countries', match: { show: true }, options: { sort: { 'sort': 1 } } };
                LeagueModel.find({ show: true }).sort({ sort: 1 }).populate(populateOptions).exec(cb);
            });

            /* Table */
            parallels = parallels.concat(function (cb) {
                request(`/tournaments/tables?ids=${tournament._id}`)
                    .then(response => {
                        let tables = response.data.map(function (table) {
                            table.teams = table.teams.map(function (item) {
                                item.form = item.form.slice(-5);
                                return item;
                            });

                            return table;
                        });

                        tables = _.sortBy(tables, 'stageName');

                        cb(null, tables);
                    });
            });

            /* Stats */
            parallels = parallels.concat(function (cb) {
                request(`/tournaments/players?ids=${tournament._id}`)
                    .then(response => {
                        const summed = sumStats(response.data);
                        const goals = summed
                            .sort((a, b) => a.goals >= b.goals ? -1 : 1)
                            .slice(0, 15);

                        const assists = summed
                            .sort((a, b) => a.assists >= b.assists ? -1 : 1)
                            .slice(0, 15);

                        cb(null, { goals: goals, assists: assists });
                    });
            });

            /* Recent/comming games widget */
            parallels = parallels.concat(function (cb) {
                request(`/tournaments/games?ids=${tournament._id}`)
                    .then(response => {

                        var games = response.data
                            .map(game => {
                                game.dateTime = game.timestamp ? moment.unix(game.timestamp) : null;
                                return game;
                            }).sort((a, b) => {
                                if (!a.dateTime && !b.dateTime) {
                                    return a.tourNumber < b.tourNumber ? -1 : 1;
                                }

                                if ((a.dateTime && !b.dateTime) || (a.dateTime && b.dateTime && a.dateTime.isBefore(b.dateTime))) {
                                    return -1;
                                } else {
                                    return 1;
                                }
                            });

                        let recent = games.filter(function (item) {
                            return item.dateTime && item.state == 'CLOSED';
                        });

                        let comming = games
                            .filter(function (item) {
                                if (item.teams[0].name.toLowerCase() == 'tbd' || item.teams[1].name.toLowerCase() == 'tbd') {
                                    return false;
                                }
                                return !item.dateTime || (item.dateTime && item.state != 'CLOSED');
                            })
                            .slice(0, 12);

                        var dated = comming.filter(function (item) {
                            return !!item.dateTime;
                        });

                        if (dated.length) {
                            comming = dated;
                        } else {
                            if (comming.length) {
                                comming = _.first(_.values(_.groupBy(comming, 'tourText')));
                            } else {
                                comming = [];
                            }
                        }

                        recent  = _.groupBy(recent.slice(-8), 'tourText');
                        comming = _.groupBy(comming.slice(0, 10), 'tourText');

                        cb(null, { recent: recent, comming: comming });
                    });
            });

            async.parallel(parallels, function (err, result) {
                const endTime = new Date().getTime();

                console.info(`Globals finished in ${endTime - glbsStartTime}ms.`);

                res.locals.globals.tournament = tournament;
                res.locals.globals.leagues    = result[0];
                res.locals.globals.tables     = result[1];
                res.locals.globals.stats      = result[2];
                res.locals.globals.recent     = result[3].recent;
                res.locals.globals.comming    = result[3].comming;

                res.title(Handlebars.helpers['noYear'](tournament.name));

                next();
            });
        });
    }
};
