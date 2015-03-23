"use strict";

var path        = require('path'),
    LeagueModel = require('../models/league');

module.exports = {
    index: function (req, res) {

        var populateOptions = {path: 'countries', options: {sort: {'sort': 1}}};
        LeagueModel.find({show: true}).sort({sort: 1}).populate(populateOptions).exec(function (err, docs) {
            if (err) {
                return next(err);
            }

            res.locals.globals.leagues = docs;
            res.render('main', {pageIndex: true});
        });

    }
};
