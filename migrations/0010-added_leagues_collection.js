var mongodb = require('mongodb');

var documents = [
    {
        name: 'Premier League', slug: 'premier-league', country: 'en',
        table:        [
            { position: 1, previous: 1, team: 'team 1', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 2, previous: 5, team: 'team 2', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 3, previous: 2, team: 'team 3', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 4, previous: 4, team: 'team 4', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 5, previous: 6, team: 'team 5', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 6, previous: 3, team: 'team 6', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 7, previous: 12, team: 'team 7', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 8, previous: 9, team: 'team 8', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 9, previous: 10, team: 'team 9', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 10, previous: 11, team: 'team 10', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 11, previous: 18, team: 'team 11', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
            { position: 12, previous: 17, team: 'team 12', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30}
        ],
        player_stats: {
            strikers:         [
                { number:1, previous: 1,team:'team 1',player:'Player One',games:10,goals:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:2, previous: 1,team:'team 2',player:'Player One',games:10,goals:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:3, previous: 1,team:'team 3',player:'Player One',games:10,goals:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:4, previous: 1,team:'team 4',player:'Player One',games:10,goals:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:5, previous: 1,team:'team 5',player:'Player One',games:10,goals:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:6, previous: 1,team:'team 6',player:'Player One',games:10,goals:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:7, previous: 1,team:'team 7',player:'Player One',games:10,goals:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:8, previous: 1,team:'team 8',player:'Player One',games:10,goals:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:9, previous: 1,team:'team 9',player:'Player One',games:10,goals:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:10, previous: 1,team:'team 10',player:'Player One',games:10,goals:16,home:12,away:4,perGame:1.6,position:'striker' }

            ],
            assists:          [
                { number:1, previous: 1,team:'team 1',player:'Player One',games:10,passes:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:2, previous: 1,team:'team 2',player:'Player One',games:10,passes:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:3, previous: 1,team:'team 3',player:'Player One',games:10,passes:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:4, previous: 1,team:'team 4',player:'Player One',games:10,passes:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:5, previous: 1,team:'team 5',player:'Player One',games:10,passes:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:6, previous: 1,team:'team 6',player:'Player One',games:10,passes:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:7, previous: 1,team:'team 7',player:'Player One',games:10,passes:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:8, previous: 1,team:'team 8',player:'Player One',games:10,passes:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:9, previous: 1,team:'team 9',player:'Player One',games:10,passes:16,home:12,away:4,perGame:1.6,position:'striker' },
                { number:10, previous: 1,team:'team 10',player:'Player One',games:10,passes:16,home:12,away:4,perGame:1.6,position:'striker' }

            ],
            strikers_assists: [
                { number:1, previous: 1,team:'team 1',player:'Player One',games:10,goals_passes:16,home:12,away:4,perGame:1.6,position:'striker' },
            ]
        }
    },
    {
        name:    'Championship League',slug: 'championship',country: 'en'
    },
    {
        name:    'League One',slug: 'league-one',country: 'en'
    },
    {
        name:    'Primera División',slug: 'primera-division',country: 'es'
    },
    {
        name:    'Segunda División', slug: 'segunda-division',country: 'es'
    },
    {
        name:    'Tercera División', slug: 'tercera-division',country: 'es'
    },
    {
        name:    'Serie A',slug: 'serie-a',country: 'it'
    },
    {
        name:    'Serie B',slug: 'serie-b',country: 'it'
    },
    {
        name:    'Bundesliga',slug: 'bundesliga',country: 'gr'
    },
    {
        name:    '2.Bundesliga',slug: '2-bundesliga',country: 'gr'
    },
    {
        name:    'Eredivisie',slug: 'eredivisie',country: 'nl'
    },
    {
        name:    'Primeira Liga',slug: 'portuguese-liga',country: 'pr'
    },
    {
        name:    'Pro League',slug: 'pro-league',country: 'be'
    },
    {
        name:    'Serie A',slug: 'serie-a',country: 'br'
    },
    {
        name:    'Ligue 1',slug: 'ligue-1',country: 'fr'
    }
];

exports.up = function (db, next) {
    var leagues = mongodb.Collection(db, 'leagues');
    leagues.insert(documents, next);

    next();
};

exports.down = function (db, next) {
    var leagues = mongodb.Collection(db, 'leagues');
    leagues.remove({}, next);

    next();
};
