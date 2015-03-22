"use strict";

var CountryModel = require('../models/country');

module.exports = {
    item: function (req, res, next) {
        console.log('countries called');

        var populateOptions = {path: 'tournaments', options: {sort: {'sort': 1}}};
        CountryModel.findOne().lean().populate(populateOptions).exec(function (err, doc) {
            if (!doc) {
                res.status(404);
                return next(null);
            }
            if (err) {
                return next(err);
            }

            res.render('countries/item', {country: doc, pageCountry: true});
        });
    }
};
