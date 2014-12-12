"use strict";

var _ = require('underscore');

var mongoose  = require('mongoose'),
    Aggregate = mongoose.Aggregate,
    Schema    = mongoose.Schema,
    ObjectId  = Schema.ObjectId;

var LeagueSchema = new Schema({
    id:           ObjectId,
    dc:           {type: Date, default: Date.now},
    du:           {type: Date},
    name:         {type: String},
    short:        {type: String},
    country:      {type: String},
    table:        {type: Array},
    player_stats: {type: Object}
});

/**
 * Get league by name or get all leagues
 *
 * @param {Null|String} name
 *
 * @returns {Promise}
 */
LeagueSchema.statics.get = function (name) {
    var promise;

    if (name) {
        name = name.toLowerCase();

        promise = this.find({short: name});
    } else {
        promise = this.find({}, '_id name short country', {$sort: {country: 1}}, function(err, leagues) {
            var result = {
                countries: {}
            };
            _.each(leagues, function(league) {
                result.countries[league.country] = result.countries[league.country] || [];
                result.countries[league.country].push(league);
            });
            return result;
        });
    }

    return promise.exec();
};

/**
 * @returns {Array} Array of countries with leagues
 */
LeagueSchema.statics.getCountries = function () {
    return _.sortBy(countries, 'name');
};

var model = mongoose.model('League', LeagueSchema, 'leagues');
var countries;
var leagues = model.find()
    .exec(function (err, leagues) {
        console.log('in promise resolve function');
        countries = [
            {
                name:    'Англия',
                short:   'en',
                vk:      'https://vk.com/amateurenglishleague',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'en';
                })
            },
            {
                name:    'Испания',
                short:   'es',
                vk:      'https://vk.com/amateurspanishleague',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'es';
                })
            },
            {
                name:    'Италия',
                short:   'it',
                vk:      'https://vk.com/amateurscalcioleague',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'it';
                })
            },
            {
                name:    'Германия',
                short:   'gr',
                vk:      'https://vk.com/western_europe',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'gr';
                })
            },
            {
                name:    'Бельгия',
                short:   'be',
                vk:      'https://vk.com/amateurnetherlands',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'be';
                })
            },
            {
                name:    'Бразилия',
                short:   'br',
                vk:      'https://vk.com/club74883632',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'br';
                })
            },
            {
                name:    'Нидерланды',
                short:   'nl',
                vk:      'https://vk.com/amateurnetherlands',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'nl';
                })
            },
            {
                name:    'Португалия',
                short:   'pr',
                vk:      'https://vk.com/amateur_portugal',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'pr';
                })
            }
        ];
    });

module.exports = model;
