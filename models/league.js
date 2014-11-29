"use strict";

var _ = require('underscore');

var leagues = [
    {
        id:           1,
        name:         'Barklays Premier League',
        short:        'bpl',
        country:      'en',
        table:        [
            {
                position: 1,
                previous: 1,
                team:     'team 1',
                games:    10,
                win:      10,
                draw:     0,
                loose:    0,
                for:      32,
                against:  12,
                diff:     20,
                points:   30
            },
            {
                position: 2,
                previous: 3,
                team:     'team 2',
                games:    10,
                win:      6,
                draw:     2,
                loose:    2,
                for:      41,
                against:  35,
                diff:     6,
                points:   20
            },
            {
                position: 3,
                previous: 2,
                team:     'team 3',
                games:    10,
                win:      1,
                draw:     3,
                loose:    7,
                for:      15,
                against:  25,
                diff:     -10,
                points:   6
            },
            {
                position: 4,
                previous: 4,
                team:     'team 4',
                games:    10,
                win:      1,
                draw:     3,
                loose:    7,
                for:      15,
                against:  25,
                diff:     -10,
                points:   6
            },
            {
                position: 5,
                previous: 5,
                team:     'team 4',
                games:    10,
                win:      1,
                draw:     3,
                loose:    7,
                for:      15,
                against:  45,
                diff:     -30,
                points:   2
            }
        ],
        player_stats: {
            strikers:         [
                {
                    number:   1,
                    previous: 1,
                    team:     'team 1',
                    player:   'Player One',
                    games:    10,
                    goals:    16,
                    home:     12,
                    away:     4,
                    perGame:  1.6,
                    position: 'striker'
                },
                {
                    number:   2,
                    previous: 3,
                    team:     'team 1',
                    player:   'Player One',
                    games:    10,
                    goals:    2,
                    home:     0,
                    away:     2,
                    perGame:  .2,
                    position: 'striker'
                },
                {
                    number:   3,
                    previous: 2,
                    team:     'team 1',
                    player:   'Player One',
                    games:    12,
                    goals:    1,
                    home:     1,
                    away:     0,
                    perGame:  .08,
                    position: 'striker'
                },
                {
                    number:   3,
                    previous: 2,
                    team:     'team 1',
                    player:   'Player One',
                    games:    12,
                    goals:    1,
                    home:     1,
                    away:     0,
                    perGame:  .08,
                    position: 'striker'
                },
                {
                    number:   3,
                    previous: 2,
                    team:     'team 1',
                    player:   'Player One',
                    games:    12,
                    goals:    1,
                    home:     1,
                    away:     0,
                    perGame:  .08,
                    position: 'striker'
                }
            ],
            assists:          [
                {
                    number:   1,
                    previous: 1,
                    team:     'team 1',
                    player:   'Player One',
                    games:    10,
                    passes:   16,
                    home:     12,
                    away:     4,
                    perGame:  1.6,
                    position: 'striker'
                },
                {
                    number:   2,
                    previous: 3,
                    team:     'team 1',
                    player:   'Player One',
                    games:    10,
                    passes:   2,
                    home:     0,
                    away:     2,
                    perGame:  .2,
                    position: 'striker'
                },
                {
                    number:   3,
                    previous: 2,
                    team:     'team 1',
                    player:   'Player One',
                    games:    12,
                    passes:   1,
                    home:     1,
                    away:     0,
                    perGame:  .08,
                    position: 'striker'
                }
            ],
            strikers_assists: [
                {
                    number:       1,
                    team:         'team 1',
                    player:       'Player One',
                    games:        10,
                    goals_passes: 1,
                    position:     'striker'
                },
                {
                    number:       1,
                    team:         'team 1',
                    player:       'Player One',
                    games:        21,
                    goals_passes: 2,
                    position:     'striker'
                },
                {
                    number:       1,
                    team:         'team 1',
                    player:       'Player One',
                    games:        10,
                    goals_passes: 1,
                    position:     'striker'
                }
            ]
        }
    },
    {
        id:      2,
        name:    'Championship League',
        short:   'csh',
        country: 'en',
        table:   [
            {
                position: 1,
                team:     'team 1',
                games:    10,
                win:      7,
                draw:     2,
                loose:    1,
                points:   23
            },
            {
                position: 2,
                team:     'team 2',
                games:    10,
                win:      6,
                draw:     2,
                loose:    2,
                points:   20
            },
            {
                position: 3,
                team:     'team 3',
                games:    10,
                win:      1,
                draw:     3,
                loose:    7,
                points:   6
            }
        ]
    },
    {
        id:      3,
        name:    'League One',
        short:   'lone',
        country: 'en',
        table:   [
            {
                position: 1,
                team:     'team 1',
                games:    10,
                win:      10,
                draw:     0,
                loose:    0,
                points:   30
            },
            {
                position: 2,
                team:     'team 2',
                games:    10,
                win:      6,
                draw:     2,
                loose:    2,
                points:   20
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

var countries = [
    {
        name:    'Англия',
        short:   'en',
        vk: 'https://vk.com/amateurenglishleague',
        leagues: _.filter(leagues, function (league) {
            return league.country == 'en';
        })
    },
    {
        name:    'Испания',
        short:   'es',
        vk: 'https://vk.com/amateurspanishleague',
        leagues: _.filter(leagues, function (league) {
            return league.country == 'es';
        })
    },
    {
        name:    'Италия',
        short:   'it',
        vk: 'https://vk.com/amateurscalcioleague',
        leagues: _.filter(leagues, function (league) {
            return league.country == 'it';
        })
    },
    {
        name:    'Германия',
        short:   'gr',
        vk: 'https://vk.com/western_europe',
        leagues: _.filter(leagues, function (league) {
            return league.country == 'gr';
        })
    },
    {
        name:    'Бельгия',
        short:   'be',
        vk: 'https://vk.com/amateurnetherlands',
        leagues: _.filter(leagues, function (league) {
            return league.country == 'be';
        })
    },
    {
        name:    'Бразилия',
        short:   'br',
        vk: 'https://vk.com/club74883632',
        leagues: _.filter(leagues, function (league) {
            return league.country == 'br';
        })
    },
    {
        name:    'Нидерланды',
        short:   'nl',
        vk: 'https://vk.com/amateurnetherlands',
        leagues: _.filter(leagues, function (league) {
            return league.country == 'nl';
        })
    },
    {
        name:    'Португалия',
        short:   'pr',
        vk: 'https://vk.com/amateur_portugal',
        leagues: _.filter(leagues, function (league) {
            return league.country == 'pr';
        })
    }
]
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
                item.short = item.short.toLowerCase();
                return item;
            }), {short: name});
        } else {
            result = _.uniq(leagues, false, function (item) {
                return item.country;
            });
        }

        return result;
    },

    /**
     * @returns {Array} Array of countries with leagues
     */
    getCountries: function () {
        return _.sortBy(countries, 'name');
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
