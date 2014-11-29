"use strict";

var _ = require('underscore');

var matches = [
    {
        stadium:   'Москва, Прага',
        referee:   'Пьер Луиджи Коллина',
        timeStart: '15:40',
        home:      {
            name:   'Вест Хэм Юнайтед',
            short:  'whu',
            score:  4,
            lineup: [
                {
                    name:     'Player One',
                    position: 'вр',
                    number:   1
                },
                {
                    name:     'Defender One',
                    position: 'зщ',
                    number:   21
                },
                {
                    name:     'Defender Two',
                    position: 'зщ',
                    number:   11
                },
                {
                    name:     'Defender Three',
                    position: 'зщ',
                    number:   13
                },
                {
                    name:     'Defender Four',
                    position: 'зщ',
                    number:   33
                },
                {
                    name:     'Forward Four',
                    position: 'нп',
                    number:   99
                },
                {
                    name:     'Forward Four',
                    position: 'нп',
                    number:   7
                },
                {
                    name:     'Forward Four',
                    position: 'нп',
                    number:   17
                }
            ]
        },
        away:      {
            name:   'Вулверхэмптон',
            short:  'wh',
            score:  3,
            lineup: [
                {
                    name:     'Player Seven',
                    position: 'вр',
                    number:   1
                },
                {
                    name:     'Defender Ten',
                    position: 'зщ',
                    number:   12
                },
                {
                    name:     'Defender Two',
                    position: 'зщ',
                    number:   43
                },
                {
                    name:     'Defender Four',
                    position: 'зщ',
                    number:   23
                },
                {
                    name:     'Forward Four',
                    position: 'нп',
                    number:   73
                },
                {
                    name:     'Forward Four',
                    position: 'нп',
                    number:   147
                }
            ]
        },
        time:      56,
        finished:  false,
        events:    [
            {
                team:   'whu',
                type:   'goal',
                time:   12,
                player: 'Уэйн Руни'
            }, {
                team:        'whu',
                type:        'goal',
                time:        21,
                player:      'Уэйн Руни',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dictum, orci sed volutpat posuere, magna.'
            },
            {
                team:   'whu',
                type:   'yc',
                time:   22,
                player: 'Уэйн Руни'
            },
            {
                team:        'wh',
                type:        'goal',
                time:        32,
                player:      'Уэйн Руни',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dictum, orci sed volutpat posuere, magna. ' +
                             'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dictum, orci sed volutpat posuere, magna.' +
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dictum, orci sed volutpat posuere, magna.'
            },
            {
                team:   'wh',
                time:   55,
                player: 'Уэйн Руни'
            },
            {
                team:   'wh',
                time:   55,
                player: 'Уэйн Руни'
            },
            {
                team:   'wh',
                type:   'goal',
                time:   55,
                player: 'Уэйн Руни'
            },
            {
                team:   'wh',
                type:   'rc',
                time:   67,
                player: 'Уэйн Руни'
            },
            {
                team:   'wh',
                type:   'pen',
                time:   67,
                player: 'Уэйн Руни'
            },
            {
                team:   'wh',
                type:   'inj',
                time:   67,
                player: 'Уэйн Руни'
            }
        ]
    }
];


module.exports = {
    get: function (home, away) {
        var match = _.find(matches, function (match) {
            return match.home.short == home && match.away.short == away;
        });

        if (!match) {
            return undefined;
        }

        var circle = 360;
        var degrees = Math.ceil(circle * match.time / 80);
        match.timePercent = degrees <= circle ? degrees : circle;

        return match;
    }
};
