"use strict";

var countriesModel = require('../models/country'),
    leaguesModel = require('../models/league');

module.exports = {
    countries: function (req, res) {
        console.log('countries called');
        var country = countriesModel.get(req.param('name'));

        if (!req.param('name').length || !country) {
            res.status(404);
            return;
        }

        var leagues = leaguesModel.find({country: country.short});
        console.log(leagues);

        res.render('countries', {country: country, countryLeagues: leagues, pageCountry: true});
    }
}
