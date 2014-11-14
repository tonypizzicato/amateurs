"use strict";

var _ = require('underscore');

var leagues = [
    {
        id:      1,
        name:    'Barklays Premier League',
        short:   'BPL',
        country: 'en'
    },
    {
        id:      2,
        name:    'Liga BBVA',
        short:   'BBVA',
        country: 'es'
    },
    {
        id:      3,
        name:    'Serie A',
        short:   'Serie A',
        country: 'it'
    }
];

module.exports = {
    get: function (name) {
        var result;

        if (name) {
            name = name.toLowerCase();
            result = _.findWhere(_.map(leagues, function (item) {
                return item.short.toLowerCase();
            }), {short: name});
        } else {
            result = leagues;
        }

        return result;
    }
};
