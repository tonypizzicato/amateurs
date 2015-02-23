"use strict";

var RestClient       = require('node-rest-client').Client,
    tournamentsModel = require('../../models/tournament'),
    async            = require('async');

var tournamentsMock = [{
    name:     'BPL',
    leagueId: 1,
    id:       1,
    state:    'IN PROGRESS',
    teams:    [{name: 'West Ham'}, {name: 'Aston Villa'}, {name: 'Chelsea'}]
}, {
    name:     'BPL',
    leagueId: 2,
    id:       2,
    state:    'IN PROGRESS',
    teams:    [{name: 'West Ham'}, {name: 'Aston Villa'}, {name: 'Chelsea'}]
}, {
    name:     'BPL',
    leagueId: 2,
    id:       3,
    state:    'IN PROGRESS',
    teams:    [{name: 'West Ham'}, {name: 'Aston Villa'}, {name: 'Chelsea'}]
}];

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
        var options = {
            proto: 'http://',
            host:  '82.196.6.26:3001',
            path:  '/api/tournaments/'
        };

        //var options_auth={user:"root",password:"horseremorse"};
        //var client = new RestClient(options_auth);

        //client.get(options.proto + options.host + options.path, function (data, response) {
        //    // parsed response body as js object
        //    console.log(data);
        //    // raw response
        //    console.log(response);
        //});

        // external api call
        var queries = [];

        tournamentsMock.forEach(function (item) {
            item.remoteId = item.id;

            var query = function (cb) {
                tournamentsModel.findOneAndUpdate({remoteId: item.id}, item, {upsert: true}).exec(cb);
            };
            queries.push(query);
        });

        async.parallel(queries, function () {
            tournamentsModel.find().populate('country').exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    res.status(500).json({error: err});
                    return;
                }

                res.json(docs);
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
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            console.log(arguments);
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
                console.log(err);
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
