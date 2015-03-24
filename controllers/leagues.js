'use strict';

var _                = require('underscore'),
    moment           = require('moment'),
    LeagueModel      = require('../models/league'),
    TournamentLeague = require('../models/tournament'),
    RestClient       = require('node-rest-client').Client,
    remoteConfig     = require('../config/tinyapi'),
    Promise          = require('promise');

var client = new RestClient(remoteConfig.authOptions);

module.exports = {
    item: function (req, res, next) {


        /* Leagues */
        var leagues = new Promise(function (resolve, reject) {
            var populateOptions = {path: 'countries', options: {sort: {'sort': 1}}};
            LeagueModel.find({show: true}).sort({sort: 1}).populate(populateOptions).exec(function (err, docs) {
                if (err) {
                    reject(err);
                }

                resolve(docs);
            });
        });

        /* League */
        var league = new Promise(function (resolve, reject) {
            var populateOptions = {path: 'countries', options: {sort: {'sort': 1}}};
            LeagueModel.findOne({slug: req.params.league}).populate(populateOptions).lean().exec(function (err, doc) {
                if (err) {
                    return next(err);
                }
                if (!doc) {
                    res.status(404);
                    return next(null);
                }

                TournamentLeague.find({leagueId: doc._id, show: true}).sort({sort: 1}).lean().exec(function (err, docs) {
                    var ids = docs.map(function (item) {
                        return item._id;
                    });

                    var query = [];
                    ids.forEach(function (item) {
                        query.push('tournamentId[]=' + item);
                    });

                    client.get(remoteConfig.url + '/stats/table?' + query.join('&'), function (tables) {
                        var format = 'DD/MM/YYYY';
                        tables = JSON.parse(tables);

                        tables = _.groupBy(tables, function (item) {
                            return item.tournamentId;
                        });

                        for (var id in tables) {
                            if (tables[id].length > 1) {
                                tables[id] = tables[id].sort(function (a, b) {
                                    return moment(a.date, format).isBefore(moment(b.date, format)) ? 1 : -1;
                                });
                            }
                        }

                        docs.map(function (item) {
                            item.table = tables[item.remoteId] ? tables[item.remoteId][0] : null;
                            item.table.teams = item.table.teams.map(function (item) {
                                item.form = item.form.slice(-5);
                                return item;
                            });
                        });

                        doc.countries.forEach(function (country) {
                            country.tournaments = docs.filter(function (item) {
                                return item.country.toString() == country._id.toString();
                            })
                        });

                        resolve(doc);
                    });
                });

            });
        });


        Promise.all([leagues, league]).then(function (result) {
            res.locals.globals.leagues = result[0];
            res.locals.globals.league = result[1];

            res.render('leagues/item', {league: result[1]});
        });

    }
};
