"use strict";

var LeagueModel     = require('../models/league'),
    TournamentModel = require('../models/tournament'),
    NewsModel       = require('../models/news');

var controller = {

    pre: function (req, res, next) {
        var query = {};

        if (req.params.name) {
            TournamentModel.findOne({slug: req.params.name}).lean().exec(function (err, doc) {
                if (err) {
                    return next();
                }

                findNews({country: doc.country});
            });
        } else if (req.params.league) {
            LeagueModel.findOne({slug: req.params.league}).lean().exec(function (err, doc) {
                if (err) {
                    return next();
                }

                findNews({leagueId: doc.league});
            });
        }

        function findNews() {
            NewsModel.find(query).sort({dc: -1}).exec(function (err, docs) {
                if (err) {
                    return next();
                }
                res.locals.globals.news = docs;
                res.locals.globals.newsSticked = Array.prototype.slice.call(docs.filter(function (item) {
                    return item.stick == true;
                }), 0, 5);

                console.log('news received + ' + res.locals.globals.news.length);

                next();
            });
        }
    },


    list: function (req, res, next) {
        var query = {};
        if (req.params.league) {
            query.league = req.params.league;
        }
        if (req.params.country) {
            query.country = req.params.country;
        }
        if (req.params.tournament) {
            query.tournament = req.params.tournament;
        }
        NewsModel.find(query).sort({dc: -1}).exec(function (err, news) {
            if (err) {
                return next(err);
            }
            res.render('news', {news: news});
        });
    },

    item: function (req, res, next) {
        console.log('getting news');
        NewsModel.findOne({slug: req.params.slug}, function (err, article) {
            if (err) {
                return next(err);
            }

            res.render('news/item', {article: article});
        })
    }
};

module.exports = controller;
