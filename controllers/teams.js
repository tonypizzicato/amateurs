"use strict";

var moment          = require('moment'),
    RestClient      = require('node-rest-client').Client,
    TournamentModel = require('../models/tournament'),
    LeagueModel     = require('../models/league'),
    remoteConfig    = require('../config/tinyapi'),
    Promise         = require('promise');

var client = new RestClient(remoteConfig.authOptions);

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

            /* Table */
            var table = new Promise(function (resolve, reject) {
                client.get(remoteConfig.url + '/stats/table?tournamentId=' + doc.remoteId, function (table) {
                    table = JSON.parse(table);

                    table = table.teams.filter(function (item) {
                        return item._id == req.params.id;
                    });

                    table = table.map(function (item) {
                        item.form = item.form.slice(-9);
                        return item;
                    });

                    resolve(table[0]);
                });
            });


            /* Table */
            var team = new Promise(function (resolve, reject) {
                client.get(remoteConfig.url + '/teams/' + req.params.id, function (team) {
                    team = JSON.parse(team);

                    var numSort = function (a, b) {
                        return a.number < b.number ? -1 : 1;
                    };
                    team.players = team.players.sort(function (a, b) {
                        if (!a.position) {
                            return 1;
                        }
                        if (!b.position) {
                            return -1;
                        }
                        if (a.position.toLowerCase() == 'gk') {
                            return numSort(a, b);
                        }
                        if (a.position.toLowerCase()[1] == 'b' && b.position.toLowerCase() != 'gk') {
                            return b.position.toLowerCase()[1] == 'b' ? numSort(a, b) : -1;
                        }
                        if (a.position.toLowerCase()[1] == 'm' && b.position.toLowerCase() != 'gk' && b.position.toLowerCase()[1] != 'b') {
                            return numSort(a, b);
                        }
                        return 1;
                    });

                    resolve(team);
                });
            });

            /* Recent/comming games widget */
            var games = new Promise(function (resolve, reject) {
                client.get(remoteConfig.url + '/games?tournamentId=' + doc.remoteId, function (games) {
                    games = JSON.parse(games);

                    games = games.filter(function (item) {
                        return item.teams[0]._id == req.params.id || item.teams[1]._id == req.params.id;
                    });

                    games = games.map(function (item) {
                        item.dateTime = item.dateTime ? moment(item.dateTime) : (item.date ? moment(item.date + ' ' + item.time, 'DD/MM/YYYY HH:mm') : null);
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

                    var recent = games.filter(function (item) {
                        return item.dateTime && item.dateTime.isBefore(moment()) && item.state == 'CLOSED';
                    });
                    var comming = games.filter(function (item) {
                        return !item.dateTime || (item.dateTime && (item.dateTime.isAfter(moment()) || item.dateTime.isSame(moment())) && item.state != 'CLOSED');
                    });

                    var form = recent.slice(-9);
                    recent = recent.slice(-6);
                    comming = comming.slice(0, 9);

                    resolve({recent: recent, comming: comming, form: form});
                });
            });

            Promise.all([table, team, games]).then(function (result) {
                res.render('teams/item', {tournament: doc, table: result[0], team: result[1], games: result[2]});
            });
        });
    },

    list: function (req, res, next) {
        console.log(req.params.league);
        LeagueModel.findOne({slug: req.params.league}).lean().exec(function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc) {
                return res.send(404);
            }

            /* Teams list */
            var teams = new Promise(function (resolve, reject) {
                client.get(remoteConfig.url + '/teams?leagueId=' + doc.remoteId, function (teams) {
                    teams = JSON.parse(teams);

                    resolve(teams);
                });
            });

            TournamentModel.findOne({slug: req.params.name, show: true}).lean().exec(function (err, doc) {

                /* Table */
                var table = new Promise(function (resolve, reject) {
                    client.get(remoteConfig.url + '/stats/table?tournamentId=' + doc.remoteId, function (table) {
                        table = JSON.parse(table);

                        resolve(table);
                    });
                });

                Promise.all([table, teams]).then(function (result) {
                    var teams = [];
                    result[0].teams.forEach(function (item) {
                        teams.push(result[1].filter(function (team) {
                            return team._id == item._id;
                        }).pop());
                    });

                    res.render('teams/list', {league: doc, teams: teams});
                });
            });
        });
    }
};
