"use strict";

var leaguesModel = require('../../models/league');

var leaguesMock = [
    {
        _id:         1,
        name:        'Moscow',
        tournaments: [
            {
                name:     'BPL',
                leagueId: 1,
                state:    {type: 'IN PROGRESS'},
                teams:    [{name: 'West Ham'}, {name: 'Aston Villa'}, {name: 'Chelsea'}]
            },
            {
                name:     'Championship',
                leagueId: 1,
                state:    {type: 'IN PROGRESS'},
                teams:    [{name: 'Millwall'}, {name: 'Reading'}, {name: 'QPR'}]
            },
            {
                name:     'Primera',
                leagueId: 1,
                state:    {type: 'IN PROGRESS'},
                teams:    [{name: 'Real Madrid'}, {name: 'Barcelona'}, {name: 'Atletico Madrid'}]
            }
        ]
    },
    {
        _id:         2,
        name:        'SPB',
        tournaments: [
            {
                name:     'BPL',
                leagueId: 2,
                state:    {type: 'IN PROGRESS'},
                teams:    [{name: 'West Ham'}, {name: 'Aston Villa'}, {name: 'Chelsea'}]
            }
        ]
    }
];

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

        res.json(leaguesMock);
    },

    /**
     * Get leagues items list
     *
     * /api/leagues GET call
     */
    list: function (req, res) {
        console.log('/api/leagues GET handled');

        res.json(leaguesMock);
        // external api call
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
