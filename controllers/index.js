"use strict";

var path        = require('path'),
    LeagueModel = require('../models/league');

module.exports = {
    index: function (req, res) {

        var populateOptions = {path: 'countries', options: {sort: {'sort': 1}}};
        LeagueModel.find().sort({sort: 1}).populate(populateOptions).exec(function (err, docs) {
            if (err) {
                return next(err);
            }
            console.log(docs[0].countries);
            res.locals.globals.leagues = docs;
            res.render('main', {pageIndex: true});
        });

    },

    underConstruction: function (req, res) {
        res.sendfile(path.join(req.app.get('public') + '/construct.html'));
    },

    nationalsPromo: function (req, res) {
        res.sendfile(path.join(req.app.get('public') + '/promo/nationals.html'));
    }
};
