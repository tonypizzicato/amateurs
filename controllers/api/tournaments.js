"use strict";

var RestClient       = require('node-rest-client').Client,
    tournamentsModel = require('../../models/tournament'),
    leaguesModel     = require('../../models/league'),
    async            = require('async');

var api = {

    /**
     * Get tournament item
     *
     * /api/tournaments/:id GET call
     */
    item: function (req, res) {
        console.log('/api/tournaments/:id GET handled');
    },

    /**
     * Get tournaments items list
     *
     * /api/tournaments GET call
     */
    list: function (req, res) {
        console.log('/api/tournaments GET handled');
        /**
         * if has tournament in db
         *   continue
         * else
         *   external api call
         */
        var url = 'http://82.196.6.26:443/api/tournaments/';

        var options_auth = {user: "root", password: "horseremorse"};

        leaguesModel.find({}, function (err, leagues) {
            if (err) {
                res.status(500).json({error: err});
                return;
            }

            var client = new RestClient(options_auth);

            leagues.forEach(function (league) {

                client.get(url + '?leagueId=' + league._id, function (data) {
                    var parsed = JSON.parse(data),
                        queries = [];

                    parsed.forEach(function (item) {
                        item.remoteId = item._id;
                        delete item.__v;

                        var query = function (cb) {
                            tournamentsModel.findOneAndUpdate({remoteId: item._id}, item, {upsert: true}).exec(cb);
                        };
                        queries.push(query);
                    });

                    async.parallel(queries, function () {
                        tournamentsModel.find().populate('country').exec(function (err, docs) {
                            if (err) {
                                res.status(500).json({error: err});
                                return;
                            }

                            res.json(docs);
                        });
                    });

                });
            });
        });

    },

    /**
     * Create new tournament item
     *
     * /api/tournaments POST call
     */
    create: function (req, res, next) {
        console.log('/api/tournaments POST handled');

        tournamentsModel.create(req.body, function (err, article) {
            if (err) {
                res.status(500).json({error: err});
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
        console.log('/api/tournaments/:id PUT handled');
        tournamentsModel.update({_id: req.param('id')}, {$set: req.body}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
                return;
            }

            if (count) {
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }
        });
    },

    /**
     * Delete tournament item
     *
     * /api/tournaments/:id DELETE call
     */
    delete: function (req, res) {
        console.log('/api/tournaments/:id DELETE handled');

        tournamentsModel.remove({_id: req.param('id')}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
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
