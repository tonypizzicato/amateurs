"use strict";

var _ = require('underscore');

var leagues = [
    {
        id: 1,
        name: 'Barklays Premier League',
        short: 'BPL',
        country: 'en'
    },
    {
        id: 2,
        name: 'Liga BBVA',
        short: 'BBVA',
        country: 'es'
    },
    {
        id: 3,
        name: 'Serie A',
        short: 'Serie A',
        country: 'it'
    }
];

module.exports = {
    get: function (id) {
        var result;

        if (id) {
            result = _.findWhere(_.map(leagues, function (item) {
                return item.short.toLowerCase();
            }), {short: id});
        } else {
            result = leagues;
        }

        return result;
    }
};
