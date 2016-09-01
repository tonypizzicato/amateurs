"use strict";

var _               = require('lodash'),
    TournamentModel = require('../../models/tournament'),
    CountryModel    = require('../../models/country'),
    LeagueModel     = require('../../models/league'),
    async           = require('async'),
    remoteConfig    = require('../../config/tinyapi');

import request, { SCOPE_ADMIN } from '../../utils/request';

var api = {

    /**
     * Get tournament item
     *
     * /api/tournaments/:id GET call
     */
    item: function (req, res) {
        console.info('/api/tournaments/:id GET handled');
    },

    /**
     * Get tournaments items list
     *
     * /api/tournaments GET call
     */
    list: function (req, res) {
        console.info('/api/tournaments GET handled');

        LeagueModel.find({}, function (err, leagues) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            var _tournaments = [];
            var pending      = 0;

            function getTournaments(league) {
                pending += 1;
                request(`/league/${league._id}/tournaments/active`, SCOPE_ADMIN)
                    .then(response => {
                        const tournaments = response.data;

                        var queries = [];

                        tournaments.forEach(function (item) {
                            item.remoteId = item._id;
                            item.leagueId = league._id;

                            item = _.omit(item, ['show']);

                            delete item.__v;

                            var query = function (cb) {
                                TournamentModel.findOne({ remoteId: item._id }).exec(function (err, doc) {
                                    if (doc) {
                                        TournamentModel.update({ remoteId: item._id }, { $set: item }).exec(cb);
                                    } else {
                                        TournamentModel.create(item);
                                    }
                                });
                            };
                            queries.push(query);
                        });

                        async.parallel(queries, function (err, docs) {
                            _tournaments = _tournaments.concat(docs);

                            if (!--pending) {
                                result(_tournaments);
                            }
                        });
                    });
            }

            var result = function () {
                TournamentModel.find({ state: { $in: ['CREATED', 'IN_PROGRESS'] } }).sort({
                    show: -1,
                    sort: 1
                }).populate('country').exec(function (err, docs) {
                    if (err) {
                        res.status(500).json({ error: err });
                        return;
                    }

                    res.json(docs);
                });
            };

            leagues.forEach(getTournaments);
        });

    },

    /**
     * Create new tournament item
     *
     * /api/tournaments POST call
     */
    create: function (req, res, next) {
        console.info('/api/tournaments POST handled');

        TournamentModel.create(req.body, function (err, article) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            res.json(article);
        });
    },

    /**
     * Update tournament item
     *
     * /api/tournaments/:id PUT call
     */
    save: function (req, res, next) {
        console.info('/api/tournaments/:id PUT handled');

        TournamentModel.update({ _id: req.params.id }, { $set: req.body }, function (err, count) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (req.body.country) {
                CountryModel.update({ tournaments: req.params.id }, { $pull: { tournaments: req.params.id } },
                    { multi: true }).exec(function () {
                    CountryModel.findOneAndUpdate({ _id: req.body.country }, { $addToSet: { tournaments: req.params.id } }).exec();
                });
            }

            res.status(200).json({});
        });
    },

    /**
     * Delete tournament item
     *
     * /api/tournaments/:id DELETE call
     */
    delete: function (req, res) {
        console.info('/api/tournaments/:id DELETE handled');

        TournamentModel.remove({ _id: req.params.id }, function (err, count) {
            if (err) {
                res.status(500).json({ error: err });
            }

            if (count) {
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }

            next();
        });
    }
};

module.exports = api;
