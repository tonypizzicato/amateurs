'use strict';

var _               = require('underscore'),
    moment          = require('moment'),
    LeagueModel     = require('../models/league'),
    TournamentModel = require('../models/tournament'),
    ContactModel    = require('../models/contact'),
    RestClient      = require('node-rest-client').Client,
    remoteConfig    = require('../config/tinyapi'),
    Promise         = require('promise');

var client = new RestClient(remoteConfig.authOptions);

module.exports = {
    item: function (req, res, next) {


        /* Leagues */
        var leagues = new Promise(function (resolve, reject) {
            var populateOptions = {path: 'countries', match: {show: true}, options: {sort: {'sort': 1}}};
            LeagueModel.find({show: true}).sort({sort: 1}).populate(populateOptions).exec(function (err, docs) {
                if (err) {
                    reject(err);
                }

                resolve(docs);
            });
        });

        /* League */
        var league = new Promise(function (resolve, reject) {
            var populateOptions = {path: 'countries', match: {show: true}, options: {sort: {'sort': 1}}};
            LeagueModel.findOne({slug: req.params.league}).populate(populateOptions).lean().exec(function (err, league) {
                if (err) {
                    return next(err);
                }
                if (!league) {
                    res.status(404);
                    return next(null);
                }

                TournamentModel.find({leagueId: league._id, show: true}).sort({sort: 1}).lean().exec(function (err, tournaments) {
                    var startTime = new Date().getTime();

                    var ids = tournaments.map(function (item) {
                        return item._id;
                    });

                    var query = [];
                    ids.forEach(function (item) {
                        query.push('tournamentId[]=' + item);
                    });

                    log(remoteConfig.url + '/stats/table?' + query.join('&'));

                    client.get(remoteConfig.url + '/stats/table?' + query.join('&'), function (tables) {

                        var endTime = new Date().getTime();
                        log('received Tables', (endTime - startTime) + "ms.", tables.length);

                        tables = JSON.parse(tables);

                        if(!tables.length) {
                            resolve(league);
                        }

                        tables = _.groupBy(tables, function (item) {
                            return item.tournamentId;
                        });

                        var format = 'DD/MM/YYYY';
                        for (var id in tables) {
                            if (tables[id].length > 1) {
                                tables[id] = tables[id].sort(function (a, b) {
                                    return moment(a.date, format).isBefore(moment(b.date, format)) ? 1 : -1;
                                });
                            }
                        }

                        tournaments.map(function (item) {
                            item.table = tables[item.remoteId] ? tables[item.remoteId][0] : null;
                            if(!!item.table) {
                                item.table.teams = item.table.teams.map(function (item) {
                                    item.form = item.form.slice(-5);
                                    return item;
                                });
                            }
                        });

                        league.countries.forEach(function (country) {
                            country.tournaments = tournaments.filter(function (item) {
                                return item.country.toString() == country._id.toString();
                            })
                        });

                        log('processed Tables', (endTime - startTime) + "ms.");

                        resolve(league);
                    });
                });

            });
        });

        /* Contacts */
        var contacts = new Promise(function (resolve, reject) {
            ContactModel.find({show: true, tournaments: []}).sort({sort: 1}).exec(function (err, docs) {
                if (err) {
                    reject(err);
                }

                resolve(docs);
            });
        });

        Promise.all([leagues, league, contacts]).then(function (result) {
            res.locals.globals.leagues = result[0];
            res.locals.globals.league = result[1];
            res.locals.globals.contacts = result[2];

            res.render('leagues/item', {league: result[1]});
        });

    }
};


function log(log) {
    var args = Array.prototype.slice.call(arguments, 0);
    args     = Array.prototype.concat.call([moment().format('HH:mm:ss:SSS')], args);
    return console.log.apply(null, args);
}
