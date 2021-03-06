"use strict";

var countriesModel = require('../models/country'),
    leaguesModel = require('../models/league');

module.exports = {
    countries: function (req, res) {
        console.log('countries called');
        var country = countriesModel.get(req.param('country'));

        if (!req.param('country').length || !country) {
            res.status(404).send('Not found Country');

            return;
        }

        var leagues = leaguesModel.find({country: country.short});

        res.render('countries', {country: country, countryLeagues: leagues, pageCountry: true});
    }
}
