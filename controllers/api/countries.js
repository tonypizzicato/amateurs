"use strict";

var LeagueModel  = require('../../models/league'),
    CountryModel = require('../../models/country'),
    TournamentModel = require('../../models/tournament');

var api = {

    /**
     * Get country item
     *
     * /api/countries/:id GET call
     */
    item: function (req, res) {
        console.log('/api/countries/:id GET handled');
    },

    /**
     * Get countries items list
     *
     * /api/countries GET call
     */
    list: function (req, res) {
        console.log('/api/countries GET handled');
        CountryModel.find().sort({sort: 1}).populate({path: 'tournaments', options: {sort: {'sort': 1}}}).exec(function (err, countries) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            res.json(countries);
        });
    },

    /**
     * Create new country item
     *
     * /api/countries POST call
     */
    create: function (req, res, next) {
        console.log('/api/countries POST handled');

        CountryModel.create(req.body, function (err, country) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            _updateLeague(country._id, req.body.leagueId);

            res.json(country);
        });
    },

    /**
     * Update country item
     *
     * /api/countries/:id PUT call
     */
    save: function (req, res, next) {
        console.log('/api/countries/:id PUT handled');
        CountryModel.update({_id: req.params.id}, {$set: req.body}, function (err, count) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            if (count) {
                _updateLeague(req.params.id, req.body.leagueId);

                res.status(200).json({});
            } else {
                res.status(404).json({});
            }
        });
    },

    /**
     * Delete country item
     *
     * /api/countries/:id DELETE call
     */
    delete: function (req, res, next) {
        console.log('/api/countries/:id DELETE handled');

        CountryModel.remove({_id: req.params.id}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
            }

            if (count) {
                LeagueModel.update({countries: req.params.id}, {$pull: {countries: req.params.id}}).exec();
                TournamentModel.update({country: req.params.id}, {$unset: {country: 1}}).exec();
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }

            next();
        });
    }
};

var _updateLeague = function (countryId, leagueId) {
    console.log('update leagues', countryId, leagueId);
    LeagueModel.update({countries: countryId}, {$pull: {countries: countryId}}, {multi: true}).exec(function () {
        LeagueModel.findOneAndUpdate({_id: leagueId}, {$addToSet: {countries: countryId}}).exec();
    });
};

module.exports = api;
