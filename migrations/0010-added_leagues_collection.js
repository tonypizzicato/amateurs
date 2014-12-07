var mongodb = require('mongodb');

var documents = [
    {
        name: 'Barklays Premier League', short: 'bpl', country: 'en',
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
        name:    'Championship League',short:   'csh',country: 'en'
    },
    {
        name:    'League One',short:   'lo',country: 'en'
    },
    {
        name:    'Liga BBVA',short:   'bbva',country: 'es'
    },
    {
        name:    'Serie A',short:   'seriea',country: 'it'
    },
    {
        name:    'Bundesliga',short:   'bundes',country: 'gr'
    },
    {
        name:    'Eredivisie',short:   'eredivisie',country: 'nl'
    },
    {
        name:    'Primeira Liga',short:   'primeira',country: 'pr'
    },
    {
        name:    'Pro League',short:   'proleague',country: 'be'
    },
    {
        name:    'Serie A',short:   'seriea',country: 'br'
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
