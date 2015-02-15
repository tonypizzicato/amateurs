"use strict";

var tournamentsModel = require('../../models/tournament');

var tournamentMock = {
    name:     'BPL',
    leagueId: 1,
    state:    {type: 'IN PROGRESS'},
    teams:    [{name: 'West Ham'}, {name: 'Aston Villa'}, {name: 'Chelsea'}]
};

var api = {

    /**
     * Get tournament item
     *
     * /api/tournaments/:id GET call
     */
    item: function (req, res) {
        console.log('/api/tournaments/:id GET handled');
        /**
         * if has tournament in db
         *   continue
         * else
         *   external api call
         */
    },

    /**
     * Get tournaments items list
     *
     * /api/tournaments GET call
     */
    list: function (req, res) {
        console.log('/api/tournaments GET handled');

        res.json(tournamentMock);
        // external api call
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
     * /api/tournaments/:id POST call
     */
    save: function (req, res, next) {
        console.log('/api/tournaments/:id PUT handled');
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
