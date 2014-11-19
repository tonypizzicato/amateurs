"use strict";

var _ = require('underscore');

var leagues = [
    {
        id:      1,
        name:    'Barklays Premier League',
        short:   'BPL',
        country: 'en',
        table: [
            {
                position: 1,
                team: 'team 1',
                games: 10,
                win: 10,
                draw: 0,
                loose: 0,
                points: 30
            },
            {
                position: 2,
                team: 'team 2',
                games: 10,
                win: 6,
                draw: 2,
                loose: 2,
                points: 20
            },
            {
                position: 3,
                team: 'team 3',
                games: 10,
                win: 1,
                draw: 3,
                loose: 7,
                points: 6
            }
        ],
        player_stats: {
            strikers: [
                {
                    number: 1,
                    team: 'team 1',
                    player: 'Player One',
                    games: 10,
                    goals: 1,
                    position: 'striker'
                },
                {
                    number: 1,
                    team: 'team 1',
                    player: 'Player One',
                    games: 10,
                    goals: 1,
                    position: 'striker'
                },
                {
                    number: 1,
                    team: 'team 1',
                    player: 'Player One',
                    games: 10,
                    goals: 1,
                    position: 'striker'
                }
            ],
            assists: [
                {
                    number: 1,
                    team: 'team 1',
                    player: 'Player One',
                    games: 10,
                    passes: 1,
                    position: 'striker'
                },
                {
                    number: 1,
                    team: 'team 1',
                    player: 'Player One',
                    games: 10,
                    passes: 1,
                    position: 'striker'
                },
                {
                    number: 1,
                    team: 'team 1',
                    player: 'Player One',
                    games: 10,
                    passes: 1,
                    position: 'striker'
                }
            ],
            strikers_assists: [
                {
                    number: 1,
                    team: 'team 1',
                    player: 'Player One',
                    games: 10,
                    goals_passes: 1,
                    position: 'striker'
                },
                {
                    number: 1,
                    team: 'team 1',
                    player: 'Player One',
                    games: 10,
                    goals_passes: 1,
                    position: 'striker'
                },
                {
                    number: 1,
                    team: 'team 1',
                    player: 'Player One',
                    games: 10,
                    goals_passes: 1,
                    position: 'striker'
                }
            ]
        }
    },
    {
        id:      2,
        name:    'Championship League',
        short:   'CS',
        country: 'en',
        table: [
            {
                position: 1,
                team: 'team 1',
                games: 10,
                win: 7,
                draw: 2,
                loose: 1,
                points: 23
            },
            {
                position: 2,
                team: 'team 2',
                games: 10,
                win: 6,
                draw: 2,
                loose: 2,
                points: 20
            },
            {
                position: 3,
                team: 'team 3',
                games: 10,
                win: 1,
                draw: 3,
                loose: 7,
                points: 6
            }
        ]
    },
    {
        id:      3,
        name:    'League One',
        short:   'LO',
        country: 'en',
        table: [
            {
                position: 1,
                team: 'team 1',
                games: 10,
                win: 10,
                draw: 0,
                loose: 0,
                points: 30
            },
            {
                position: 2,
                team: 'team 2',
                games: 10,
                win: 6,
                draw: 2,
                loose: 2,
                points: 20
            }
        ]
    },
    {
        id:      4,
        name:    'Liga BBVA',
        short:   'bbva',
        country: 'es'
    },
    {
        id:      5,
        name:    'Serie A',
        short:   'seriea',
        country: 'it'
    },
    {
        id:      6,
        name:    'Bundesliga',
        short:   'bundes',
        country: 'gr'
    },
    {
        id:      7,
        name:    'Eredivisie',
        short:   'eredivisie',
        country: 'nl'
    },
    {
        id:      8,
        name:    'Primeira Liga',
        short:   'primeira',
        country: 'pr'
    },
    {
        id:      9,
        name:    'Pro League',
        short:   'proleague',
        country: 'be'
    },
    {
        id:      10,
        name:    'Serie A',
        short:   'seriea',
        country: 'br'
    }
];

module.exports = {

    /**
     * Get league by name or get all leagues
     *
     * @param {Null|String} name
     *
     * @returns {Object}
     */
    get: function (name) {
        var result;

        if (name) {
            name = name.toLowerCase();
            result = _.findWhere(_.map(leagues, function (item) {
                return item.short.toLowerCase();
            }), {short: name});
        } else {
            result = _.uniq(leagues, false, function(item) {
                return item.country;
            });
        }

        return result;
    },

    /**
     * @param {Object} by Criteria object to find by { key: value }
     *
     * @returns {Object}
     */
    find: function (by) {
        return _.where(leagues, by);
    }
};
