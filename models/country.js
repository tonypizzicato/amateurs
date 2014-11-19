"use strict";

var _ = require('underscore');

var countries = [
    {
        name:  'Англия',
        url:   'england',
        short: 'en'
    }
]

module.exports = {
    get: function (name) {
        var result;

        if (name) {
            name = name.toLowerCase();
            result = _.findWhere(_.map(countries, function (item) {
                item.url = item.url.toLowerCase();

                return item;
            }), {short: name});
        } else {
            result = countries;
        }

        return result;
    }
}
