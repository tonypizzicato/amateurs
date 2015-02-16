"use strict";

var countriesModel = require('../../models/country');

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
        countriesModel.find(function (err, countries) {
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

        countriesModel.create(req.body, function (err, country) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            console.log(arguments);
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
        countriesModel.update({_id: req.param('id')}, {$set: req.body}, function (err, count) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            if (count) {
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

        countriesModel.remove({_id: req.param('id')}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
            }

            if (count) {
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }

            next();
        });
    }
};

module.exports = api;
