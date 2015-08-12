"use strict";

var _               = require('underscore'),
    async           = require('async'),
    moment          = require('moment-timezone'),
    LeagueModel     = require('../models/league'),
    TournamentModel = require('../models/tournament'),
    ContactModel    = require('../models/contact'),
    NewsModel       = require('../models/news'),
    Promise         = require('promise');

var controller = {

    pre: function (req, res, next) {
        getNewsList(req, function (err, docs) {
            if (err) {
                return next();
            }

            res.locals.globals.news = _.groupBy(docs.slice(0, 15), function (item) {
                return moment(item.dc).locale('ru').format('DD MMMM YYYY');
            });

            var newsSticked = Array.prototype.slice.call(docs.filter(function (item) {
                return item.stick == true;
            }), 0, 5);

            newsSticked = newsSticked.sort(function (a, b) {
                return a.dc < b.dc ? 1 : -1;
            });

            res.locals.globals.newsSticked = newsSticked;

            next();
        });
    },


    list: function (req, res, next) {

        getNewsList(req, function (err, docs) {
            if (err) {
                return next(err);
            }

            docs = _.groupBy(docs, function (item) {
                return moment(item.dc).locale('ru').format('Do MMMM YYYY, dddd');
            });

            res.render('news/list', {news: docs, pageNews: true});
        });
    },

    item: function (req, res, next) {
        var populateOptions = {path: 'country'};
        NewsModel.findOne({slug: req.params.slug}).populate(populateOptions).exec(function (err, article) {
            if (err) {
                return next(err);
            }

            res.title(article.title);
            res.render('news/item', {article: article, pageNews: true});
        })
    },

    globals: function (req, res, next) {
        var parallels = [];
        /* Leagues */
        var populateOptions = {path: 'countries', match: {show: true}, options: {sort: {'sort': 1}}};
        LeagueModel.find({show: true}).sort({sort: 1}).populate(populateOptions).exec(function (err, league) {

            res.locals.globals.leagues = league;

            ContactModel.find({show: true, tournaments: []}).sort({sort: 1}).exec(function (err, contacts) {
                res.locals.globals.contacts = contacts;


                console.log('globals end');
                next();
            });
        });

    }
};

var getNewsList = function (req, cb) {
    var query  = {},
        series = [];

    /** Get league if defined in request */
    series = series.concat(function (cb) {
        LeagueModel.findOne({slug: req.params.league}).lean().exec(cb);
    });

    /** Get tournament if defined in request */
    if (req.params.name) {
        series = series.concat(function (league, cb) {
            if (!league) {
                return cb(true);
            }

            var query = {
                slug:     req.params.name,
                leagueId: league._id
            };

            TournamentModel.findOne(query).lean().exec(cb);
        });
    }

    async.waterfall(series, function (err, res) {
        if (err || !res) {
            return cb(true);
        }
        var query = {};

        if (req.params.name) {
            query.leagueId = res.leagueId;
            query.country  = res.country;
        } else if (req.params.league) {
            query.leagueId = res._id;
        }

        findNews(query, cb);
    });

    function findNews(query, cb) {
        var populateOptions = {path: 'country'};
        query.show          = true;

        NewsModel.find(query).sort({dc: -1}).lean().populate(populateOptions).exec(function (err, docs) {
            cb(err, docs);
        });
    }
};

module.exports = controller;
