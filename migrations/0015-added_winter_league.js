var mongodb = require('mongodb');

exports.up = function (db, next) {
    var leagues = mongodb.Collection(db, 'leagues');
    var doc = {name: 'Зимний Чемпионат', slug: 'winter', format: 'round_playoff', groupsCount: 4,
        groups: [
            {
                name: 'А',
                table: [
                    { position: 1, previous: 1, team: 'team 1', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 2, previous: 5, team: 'team 2', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 3, previous: 2, team: 'team 3', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 4, previous: 4, team: 'team 4', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 5, previous: 6, team: 'team 5', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 6, previous: 3, team: 'team 6', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                ]
            },
            {
                name: 'Б',
                table: [
                    { position: 1, previous: 1, team: 'team 1', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 2, previous: 5, team: 'team 2', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 3, previous: 2, team: 'team 3', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 4, previous: 4, team: 'team 4', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 5, previous: 6, team: 'team 5', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 6, previous: 3, team: 'team 6', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                ]
            },
            {
                name: 'В',
                table: [
                    { position: 1, previous: 1, team: 'team 1', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 2, previous: 5, team: 'team 2', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 3, previous: 2, team: 'team 3', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 4, previous: 4, team: 'team 4', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 5, previous: 6, team: 'team 5', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 6, previous: 3, team: 'team 6', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                ]
            },
            {
                name: 'Г',
                table: [
                    { position: 1, previous: 1, team: 'team 1', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 2, previous: 5, team: 'team 2', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 3, previous: 2, team: 'team 3', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 4, previous: 4, team: 'team 4', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 5, previous: 6, team: 'team 5', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                    { position: 6, previous: 3, team: 'team 6', games: 10, win: 10, draw: 0, loose: 0, for: 32, against: 12, diff: 20, points: 30},
                ]
            }
        ],

        fixture: [
        {
            round: 1,
            group: 'A',
            games: [
                {
                    home:  'team 1',
                    away:  'team 3',
                    date:  '2015-03-17',
                    time:  '12:00',
                    pitch: 'ЦСКА',
                    score: {
                        home: 4,
                        away: 5
                    }
                },
                {
                    home:  'team 2',
                    away:  'team 5',
                    date:  '2015-03-17',
                    time:  '13:40',
                    pitch: 'ЦСКА'
                },
                {
                    home:  'team22 4',
                    away:  'team 6',
                    date:  '2015-03-17',
                    time:  '12:00',
                    pitch: 'ЦСКА',
                    score: {
                        home: 1,
                        away: 3
                    }
                }
            ]
        },{
            round: 1,
            group: 'Б',
            games: [
                {
                    home:  'team 1',
                    away:  'team 3',
                    date:  '2015-03-17',
                    time:  '12:00',
                    pitch: 'ЦСКА',
                    score: {
                        home: 4,
                        away: 5
                    }
                },
                {
                    home:  'team 2',
                    away:  'team 5',
                    date:  '2015-03-17',
                    time:  '13:40',
                    pitch: 'ЦСКА'
                },
                {
                    home:  'team22 4',
                    away:  'team 6',
                    date:  '2015-03-17',
                    time:  '12:00',
                    pitch: 'ЦСКА',
                    score: {
                        home: 1,
                        away: 3
                    }
                }
            ]
        },{
            round: 1,
            group: 'В',
            games: [
                {
                    home:  'team 1',
                    away:  'team 3',
                    date:  '2015-03-17',
                    time:  '12:00',
                    pitch: 'ЦСКА',
                    score: {
                        home: 4,
                        away: 5
                    }
                },
                {
                    home:  'team 2',
                    away:  'team 5',
                    date:  '2015-03-17',
                    time:  '13:40',
                    pitch: 'ЦСКА'
                },
                {
                    home:  'team22 4',
                    away:  'team 6',
                    date:  '2015-03-17',
                    time:  '12:00',
                    pitch: 'ЦСКА',
                    score: {
                        home: 1,
                        away: 3
                    }
                }
            ]
        },{
            round: 1,
            group: 'Г',
            games: [
                {
                    home:  'team 1',
                    away:  'team 3',
                    date:  '2015-03-17',
                    time:  '12:00',
                    pitch: 'ЦСКА',
                    score: {
                        home: 4,
                        away: 5
                    }
                },
                {
                    home:  'team 2',
                    away:  'team 5',
                    date:  '2015-03-17',
                    time:  '13:40',
                    pitch: 'ЦСКА'
                },
                {
                    home:  'team22 4',
                    away:  'team 6',
                    date:  '2015-03-17',
                    time:  '12:00',
                    pitch: 'ЦСКА',
                    score: {
                        home: 1,
                        away: 3
                    }
                }
            ]
        },
    ]};
    leagues.insert(doc, next);

    next();
};

exports.down = function (db, next) {
    var leagues = mongodb.Collection(db, 'leagues');
    var doc = {slug: 'winter'};
    leagues.remove(doc, next);

    next();
};
