"use strict";

var _               = require('lodash'),
    moment          = require('moment'),
    TournamentModel = require('../models/tournament'),
    LeagueModel     = require('../models/league'),
    Promise         = require('promise');

import request from '../utils/request';

module.exports = {
    item: function (req, res, next) {
        LeagueModel.findOne({ slug: req.params.league }, function (err, league) {
            TournamentModel.findOne({ slug: req.params.name, leagueId: league._id, show: true }).lean().exec(function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next();
                }


                var leagueStage = _.find(tournament.stages, { format: 'LEAGUE' });

                if (leagueStage) {
                    /* Table */
                    var table = new Promise(function (resolve) {

                        request(`/tournaments/tables?ids=${tournament._id}`)
                            .then(response => {
                                let table = response.data[0].teams
                                    .filter(team => team.teamId == req.params.id)
                                    .map(team => {
                                        team.form = team.form.slice(-9);

                                        return team;
                                    });

                                resolve(table[0]);
                            });
                    });
                } else {
                    var table = Promise.resolve();
                }

                /* Team */
                var team = new Promise(function (resolve) {

                    request(`/teams/${req.params.id}/roster`)
                        .then(response => {
                            const team = response.data;

                            var numSort = (a, b) => a.number < b.number ? -1 : 1;

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
                var games = new Promise(function (resolve) {

                    request(`/tournaments/games?ids=${tournament._id}`)
                        .then(response => {
                            const games = response.data
                                .filter(game => game.teams[0]._id == req.params.id || game.teams[1]._id == req.params.id)
                                .map(game=> {
                                    game.dateTime = game.timestamp ? moment.unix(game.timestamp) : null;

                                    return game;
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

                            let recent  = games.filter(game => {
                                return game.dateTime && game.dateTime.isBefore(moment()) && game.state == 'CLOSED';
                            });
                            let comming = games.filter(game => {
                                return !game.dateTime || (game.dateTime && (game.dateTime.isAfter(moment()) || game.dateTime.isSame(moment())) && game.state != 'CLOSED');
                            });

                            const form = recent.slice(-9);
                            recent     = recent.slice(-6);
                            comming    = comming.slice(0, 6);

                            resolve({ recent: recent, comming: comming, form: form });
                        });
                });

                Promise.all([table, team, games]).then(function (result) {
                    res.title(result[1].teamName);

                    res.render('teams/item', { tournament: tournament, table: result[0], team: result[1], games: result[2], pageTeams: true });
                });
            });
        });
    },

    list: function (req, res, next) {
        LeagueModel.findOne({ slug: req.params.league }).lean().exec(function (err, league) {
            if (err) {
                return next(err);
            }
            if (!league) {
                return res.sendStatus(404);
            }

            TournamentModel.findOne({ slug: req.params.name, leagueId: league._id, show: true }).lean().exec(function (err, tournament) {
                /* Teams list */
                var teams = new Promise(function (resolve) {

                    request(`/tournaments/teams?ids=${tournament._id}`)
                        .then(response => resolve(_.sortBy(response.data, 'name')));
                });

                /* Table */
                teams.then(function (teams) {
                    res.title('Клубы');
                    res.render('teams/list', { league: tournament, teams: teams, pageTeams: true });
                });
            });
        });
    }
};
