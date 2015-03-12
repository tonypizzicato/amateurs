"use strict";

var CountryModel = require('../models/country');

module.exports = {
    item: function (req, res, next) {
        console.log('countries called');

        CountryModel.findOne().populate({path: 'tournaments', options: {sort: {'sort': 1}}}).exec(function (err, doc) {
            if (!doc) {
                res.status(404);
                return next(null);
            }
            if (err) {
                return next(err);
            }
console.log(doc);
            res.render('countries/item', {country: doc, pageCountry: true});
        });
    }
};
