"use strict";

var async        = require('async'),
    RestClient   = require('node-rest-client').Client,
    leaguesModel = require('../../models/league'),
    remoteConfig = require('../../config/tinyapi');

var api = {

    /**
     * Get league item
     *
     * /api/leagues/:id GET call
     */
    item: function (req, res) {
        console.log('/api/leagues/:id GET handled');
        /**
         * if has league in db
         *   continue
         * else
         *   external api call
         */

        leaguesModel.findOne(req.param('id'), function (err, league) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            res.json(league);
        });
    },

    /**
     * Get leagues items list
     *
     * /api/leagues GET call
     */
    list: function (req, res) {
        console.log('/api/leagues GET handled');

        var client = new RestClient(remoteConfig.authOptions);

        client.get(remoteConfig.url, function (data) {
            var parsed = JSON.parse(data),
                queries = [];

            parsed.forEach(function (league) {
                league.remoteId = league._id;
                delete league.__v;

                var query = function (cb) {
                    leaguesModel.findOneAndUpdate({remoteId: league._id}, league, {upsert: true}).exec(cb);
                };
                queries.push(query);
            });

            async.parallel(queries, function (err, docs) {
                if (err) {
                    res.status(500).json({error: err});
                    return;
                }

                res.json(docs);
            });
        });

    },

    /**
     * Create new league item
     *
     * /api/leagues POST call
     */
    create: function (req, res, next) {
        console.log('/api/leagues POST handled');

        leaguesModel.create(req.body, function (err, article) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            console.log(arguments);
            res.json(article);
        });
    },

    /**
     * Update league item
     *
     * /api/leagues/:id POST call
     */
    save: function (req, res, next) {
        console.log('/api/leagues/:id PUT handled');
    },

    /**
     * Delete league item
     *
     * /api/leagues/:id DELETE call
     */
    delete: function (req, res) {
        console.log('/api/leagues/:id DELETE handled');

        leaguesModel.remove({_id: req.param('id')}, function (err, count) {
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
