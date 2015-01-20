"use strict";

var _ = require('underscore');

var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    ObjectId  = Schema.ObjectId;

var LeagueSchema = new Schema({
    id:           ObjectId,
    dc:           {type: Date, default: Date.now},
    du:           {type: Date},
    name:         {type: String},
    slug:         {type: String},
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

        promise = this.find({slug: name});
    } else {
        promise = this.find({});
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
        countries = [
            {
                name:    'Англия',
                slug:   'en',
                vk:      'https://vk.com/amateurenglishleague',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'en';
                })
            },
            {
                name:    'Испания',
                slug:   'es',
                vk:      'https://vk.com/amateurspanishleague',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'es';
                })
            },
            {
                name:    'Италия',
                slug:   'it',
                vk:      'https://vk.com/amateurscalcioleague',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'it';
                })
            },
            {
                name:    'Германия',
                slug:   'gr',
                vk:      'https://vk.com/western_europe',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'gr';
                })
            },
            {
                name:    'Бельгия',
                slug:   'be',
                vk:      'https://vk.com/amateurnetherlands',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'be';
                })
            },
            {
                name:    'Бразилия',
                slug:   'br',
                vk:      'https://vk.com/club74883632',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'br';
                })
            },
            {
                name:    'Нидерланды',
                slug:   'nl',
                vk:      'https://vk.com/amateurnetherlands',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'nl';
                })
            },
            {
                name:    'Португалия',
                slug:   'pr',
                vk:      'https://vk.com/amateur_portugal',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'pr';
                })
            },
            {
                name:    'Франция',
                slug:   'fr',
                vk:      'https://vk.com/amateur_france',
                leagues: _.filter(leagues, function (league) {
                    return league.country == 'fr';
                })
            }
        ];
    });

module.exports = model;
