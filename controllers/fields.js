"use strict";

var _               = require('lodash'),
    LeagueModel     = require('../models/league'),
    TournamentModel = require('../models/tournament'),
    FieldModel      = require('../models/field');

module.exports = {

    item: function (req, res, next) {
        LeagueModel.findOne({slug: req.params.league}).exec(function (err, league) {
            var populateTournaments = {path: 'tournaments', options: {sort: {'sort': 1}}};
            FieldModel.findOne({slug: req.params.fieldName}).populate(populateTournaments).exec(function (err, field) {
                if (err) {
                    return next(err);
                }
                if (!field) {
                    return res.status(404).render('404');
                }

                var populateCountries = {path: 'tournaments.country', model: 'Country'};
                FieldModel.populate(field, populateCountries, function (err, field) {

                    field.countries = _.groupBy(field.tournaments, function (tournament) {
                        return tournament.country._id;
                    });

                    field.countries = _.mapValues(field.countries, function (tournaments) {
                        return {
                            country:     tournaments.length ? tournaments[0].country : null,
                            tournaments: tournaments
                        };
                    });

                    res.title('Поля: ' + field.title);
                    res.render('fields/item', {field: field, pageFields: true});
                });

            });
        });
    },

    list: function (req, res) {
        LeagueModel.findOne({slug: req.params.league}).exec(function (err, league) {
            var query = {show: true, leagueId: league._id};
            if (req.params.name) {
                TournamentModel.findOne({slug: req.params.name}).exec(function (err, tournament) {
                    if (!tournament) {
                        return res.status(404).render('404');
                    }

                    query.tournaments = tournament._id;
                    fields(query);
                });
            } else {
                fields(query);
            }
        });

        var fields = function (query) {
            FieldModel.find(query).exec(function (err, fields) {
                res.render('fields/list', {fields: fields, pageFields: true});
            });
        }
    }
};
