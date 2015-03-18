"use strict";

var _      = require('underscore'),
    moment = require('moment');

var fixtures = [
    {
        league:  'premier-league',
        fixture: [
            {
                round: 1,
                games: [
                    {
                        home:  'team 1',
                        away:  'team 3',
                        date:  '2015-03-17',
                        time:  '12:00',
                        pitch: 'Прага',
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
                        pitch: 'Прага'
                    },
                    {
                        home:  'team22 4',
                        away:  'team 6',
                        date:  '2015-03-17',
                        time:  '12:00',
                        pitch: 'Анохина',
                        score: {
                            home: 1,
                            away: 3
                        }
                    }
                ]
            },
            {
                round: 2,
                games: [
                    {
                        home:  'team 1',
                        away:  'team 6',
                        date:  '2015-03-24',
                        time:  '12:00',
                        pitch: 'Анохина'
                    },
                    {
                        home:  'team 2',
                        away:  'team 4',
                        date:  '2015-03-17',
                        time:  '13:40',
                        pitch: 'Прага',
                        score: {
                            home: 3,
                            away: 3
                        }
                    },
                    {
                        home:  'team 3',
                        away:  'team 5',
                        date:  '2015-03-24',
                        time:  '12:00',
                        pitch: 'Прага'
                    }
                ]
            },
            {
                round: 3,
                games: [
                    {
                        home:  'team 1',
                        away:  'team 2',
                        date:  '2015-04-01',
                        time:  '12:00',
                        pitch: 'Анохина'
                    },
                    {
                        home:  'team 3',
                        away:  'team 4',
                        date:  '2015-04-01',
                        time:  '10:40',
                        pitch: 'Прага'
                    },
                    {
                        home:  'team 5',
                        away:  'team 6',
                        date:  '2015-04-01',
                        time:  '12:20',
                        pitch: 'Прага'
                    }
                ]
            }
        ]
    }
];

function prepare(league) {
    var league = _.findWhere(fixtures, {league: league});
    if (league) {
        var games = _.flatten(_.pluck(league.fixture, 'games'));

        var sorted = _.sortBy(games, function (game) {
            return moment(game.date + ' ' + game.time).unix();
        });
        return sorted;
    }

    return null;
};

module.exports = {

    recent: function (league) {
        var now = moment();
        var sorted = prepare(league);

        if (!sorted) {
            return null;
        }

        var recent = _.filter(sorted, function (game) {
            var gameTime = moment(game.date + ' ' + game.time);

            return (now.isAfter(game.date + ' ' + game.time) || now.isBefore(gameTime.add(80, 'minutes'))) && game.score;
        });

        return _.groupBy(_.last(recent, 5), function (game) {
            return game.date;
        });
    },

    live: function (league) {
        var now = moment();
        var sorted = prepare(league);

        if (!sorted) {
            return null;
        }

        var live = _.filter(sorted, function (game) {
            var gameTime = moment(game.date + ' ' + game.time);

            return now.isBefore(gameTime.add(80, 'minutes')) && game.score;
        });

        return live;
    },

    comming: function (league) {
        var now = moment();
        var sorted = prepare(league);

        if (!sorted) {
            return null;
        }

        var comming = _.filter(sorted, function (game) {
            var gameTime = moment(game.date + ' ' + game.time);

            return now.isBefore(gameTime) && !game.score;
        });

        return _.groupBy(_.last(comming, 5), function (game) {
            return game.date;
        });
    }
}
