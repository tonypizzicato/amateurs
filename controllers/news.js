"use strict";

var _               = require('lodash'),
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

            let newsSticked = Array.prototype.slice.call(docs.filter(function (item) {
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

            res.render('news/list', { news: docs, pageNews: true });
        });
    },

    item: function (req, res, next) {
        const populateOptions = { path: 'country' };
        const dateFrom        = moment(req.params.date, "DD-MM-YYYY");
        const dateTill        = moment(dateFrom).add(1, 'd');
        console.log(req.params.date, dateFrom.toDate(), dateTill.toDate());

        LeagueModel.findOne({ slug: req.params.league }).exec(function (err, league) {
            NewsModel
                .findOne({ leagueId: league._id, slug: req.params.slug, dc: { $gte: dateFrom.toDate(), $lte: dateTill.toDate() } })
                .populate(populateOptions)
                .exec(function (err, article) {
                    if (err) {
                        return next(err);
                    }

                    res.title(article.title);
                    res.render('news/item', { article: article, pageNews: true });
                });
        });
    },

    globals: function (req, res, next) {
        /* Leagues */
        const populateOptions = { path: 'countries', match: { show: true }, options: { sort: { 'sort': 1 } } };
        LeagueModel.find({ show: true }).sort({ sort: 1 }).populate(populateOptions).exec(function (err, league) {

            res.locals.globals.leagues = league;

            ContactModel.find({
                leagueId:    res.locals.globals.league._id,
                show:        true,
                tournaments: []
            }).sort({ sort: 1 }).exec(function (err, contacts) {
                res.locals.globals.contacts = contacts;

                next();
            });
        });

    }
};

var getNewsList = function (req, cb) {
    let series = [];

    /** Get league if defined in request */
    series = series.concat(function (cb) {
        LeagueModel.findOne({ slug: req.params.league }).lean().exec(cb);
    });

    /** Get tournament if defined in request */
    if (req.params.name) {
        series = series.concat(function (league, cb) {
            if (!league) {
                return cb(true);
            }

            const query = {
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
        const query = {};

        if (req.params.name) {
            query.leagueId = res.leagueId;
            query.country  = res.country;
        } else if (req.params.league) {
            query.leagueId = res._id;
        }

        findNews(query, cb);
    });

    function findNews(query, cb) {
        const populateOptions = { path: 'country' };
        query.show            = true;

        NewsModel.aggregate([
            { $match: query },
            { $group: { _id: { slug: "$slug", date: { $dateToString: { format: "%d-%m-%Y", date: "$dc" } } } } }
        ]).exec((err, slugs) => {
            NewsModel.find({ slug: { $in: slugs.map(sl => _.get(sl, '_id.slug')) } }).sort({ dc: -1 }).lean().populate(populateOptions).exec(function (err, docs) {
                cb(err, docs);
            });
        });
    }
};

module.exports = controller;
