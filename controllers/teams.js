"use strict";

var moment          = require('moment'),
    request         = require('request'),
    TournamentModel = require('../models/tournament'),
    LeagueModel     = require('../models/league'),
    remoteConfig    = require('../config/tinyapi'),
    Promise         = require('promise');

module.exports = {
    item: function (req, res, next) {
        LeagueModel.findOne({slug: req.params.league}, function (err, league) {
            TournamentModel.findOne({slug: req.params.name, leagueId: league._id, show: true}).lean().exec(function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next();
                }

                /* Table */
                var table = new Promise(function (resolve, reject) {
                    remote(remoteConfig.url + '/stats/table?tournamentId=' + tournament.remoteId, function (err, response, table) {
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
                    remote(remoteConfig.url + '/teams/' + req.params.id, function (err, response, team) {
                        var numSort  = function (a, b) {
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
                    remote(remoteConfig.url + '/games?tournamentId=' + tournament.remoteId, function (err, response, games) {
                        games = games.filter(function (item) {
                            return item.teams[0]._id == req.params.id || item.teams[1]._id == req.params.id;
                        });

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

                        var recent  = games.filter(function (item) {
                            return item.dateTime && item.dateTime.isBefore(moment()) && item.state == 'CLOSED';
                        });
                        var comming = games.filter(function (item) {
                            return !item.dateTime || (item.dateTime && (item.dateTime.isAfter(moment()) || item.dateTime.isSame(moment())) && item.state != 'CLOSED');
                        });

                        var form = recent.slice(-9);
                        recent   = recent.slice(-6);
                        comming  = comming.slice(0, 6);

                        resolve({recent: recent, comming: comming, form: form});
                    });
                });

                Promise.all([table, team, games]).then(function (result) {
                    res.render('teams/item',
                        {tournament: tournament, table: result[0], team: result[1], games: result[2], pageTeams: true});
                });
            });
        });
    },

    list: function (req, res, next) {
        LeagueModel.findOne({slug: req.params.league}).lean().exec(function (err, league) {
            if (err) {
                return next(err);
            }
            if (!league) {
                return res.send(404);
            }

            /* Teams list */
            var teams = new Promise(function (resolve, reject) {
                remote(remoteConfig.url + '/teams?leagueId=' + league.remoteId, function (err, response, teams) {
                    teams = JSON.parse(teams);

                    resolve(teams);
                });
            });

            TournamentModel.findOne({slug: req.params.name, leagueId: league._id, show: true}).lean().exec(function (err, tournament) {
                /* Table */
                var table = new Promise(function (resolve, reject) {
                    remote(remoteConfig.url + '/stats/table?tournamentId=' + tournament.remoteId, function (err, response, table) {
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

                    res.render('teams/list', {league: tournament, teams: teams, pageTeams: true});
                });
            });
        });
    }
};

function remote(url, cb) {
    request.get({
        uri:  url,
        auth: remoteConfig.authOptions,
        gzip: true,
        json: true
    }, cb);
}
