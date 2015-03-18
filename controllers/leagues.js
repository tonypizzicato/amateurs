'use strict';

var LeagueModel = require('../models/league');

module.exports = {
    item: function (req, res) {
        var populateOptions = {path: 'countries', options: {sort: {'sort': 1}}};
        LeagueModel.findOne({slug: req.params.league}).lean().populate(populateOptions).exec(function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc) {
                res.status(404);
                return next(null);
            }

            populateOptions = {path: 'countries.tournaments', options: {sort: {'sort': 1}}};
            LeagueModel.populate(doc, populateOptions, function (err, doc) {
                res.render('leagues/item', {league: doc, tableFull: false});
            });
        });
    }
};
