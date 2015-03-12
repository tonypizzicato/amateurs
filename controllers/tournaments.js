'use strict';

var TournamentsModel = require('../models/tournament');

module.exports = {
    list: function (req, res, next) {
        TournamentsModel.find({slug: req.params.name}, function (err, docs) {
            if (err) {
                return next(err);
            }
            res.render('tournaments/list', {tournaments: docs, pageTournaments: true});
        });
    },

    item: function (req, res, next) {
        TournamentsModel.findOne({slug: req.params.name}, function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc) {
                res.status(404);
                return next(null);
            }

            res.render('tournaments/item', {tournament: doc, tableFull: false});
        });
    },

    table: function (req, res) {
        var leagueName = req.param('name'),
            league = TournamentsModel.get(leagueName);


        league.then(function (leagues) {
            if (!leagues.length) {
                res.status(404).send('Not found League');

                return;
            }

            res.render('table', {league: leagues.pop().toObject(), tableFull: true});
        });
    }
};
