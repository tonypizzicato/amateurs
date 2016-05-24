"use strict";

var async        = require('async'),
    RestClient   = require('node-rest-client').Client,
    LeagueModel  = require('../../models/league'),
    remoteConfig = require('../../config/tinyapi');


var client = new RestClient(remoteConfig.authOptions);

var api = {

    /**
     * Get league item
     *
     * /api/leagues/:id GET call
     */
    item: function (req, res) {
        console.info('/api/leagues/:id GET handled');
        /**
         * if has league in db
         *   continue
         * else
         *   external api call
         */

        LeagueModel.findOne(req.params.id, function (err, league) {
            if (err) {
                console.info(err);
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
        console.info('/api/leagues GET handled');

        client.get(remoteConfig.url + '/leagues', function (leagues) {
            var queries = [];

            leagues.forEach(function (league) {
                league.remoteId = league._id;
                delete league.__v;

                var query = function (cb) {
                    LeagueModel.findOneAndUpdate({remoteId: league._id}, league, {new: true, upsert: true, setDefaultsOnInsert: true}).exec(cb);
                };
                queries.push(query);
            });

            async.parallel(queries, function (err, docs) {
                if (err) {
                    res.status(500).json({error: err});
                    return;
                }

                res.json(docs.sort(function (a, b) {
                    return a.sort <= b.sort ? -1 : 1
                }));
            });
        });

    },

    /**
     * Update league item
     *
     * /api/leagues/:id POST call
     */
    save: function (req, res, next) {
        console.info('/api/leagues/:id PUT handled');

        LeagueModel.update({_id: req.params.id}, {$set: req.body}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
                return;
            }
            if (!count) {
                res.status(404);
                next();
            }

            res.status(200).json({});
        });
    }
};

module.exports = api;
