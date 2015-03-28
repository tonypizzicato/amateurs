"use strict";

var _               = require('underscore'),
    moment          = require('moment-timezone'),
    LeagueModel     = require('../models/league'),
    TournamentModel = require('../models/tournament'),
    ContactModel    = require('../models/contact'),
    NewsModel       = require('../models/news'),
    Promise         = require('promise'),

    tz              = 'Europe/Moscow';

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
                return a.sort < b.sort ? -1 : 1;
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

            res.render('news/item', {article: article, pageNews: true});
        })
    },

    globals: function (req, res, next) {

        /* Leagues */
        var leagues = new Promise(function (resolve, reject) {
            var populateOptions = {path: 'countries', match: {show: true}, options: {sort: {'sort': 1}}};
            LeagueModel.find({show: true}).sort({sort: 1}).populate(populateOptions).exec(function (err, docs) {
                if (err) {
                    return reject(err);
                }

                resolve(docs);
            });
        });

        /* Contacts */
        var contacts = new Promise(function (resolve, reject) {
            ContactModel.find({show: true, tournaments: []}).sort({sort: 1}).exec(function (err, docs) {
                if (err) {
                    reject(err);
                }

                resolve(docs);
            });
        });

        Promise.all([leagues, contacts]).then(function (result) {
            res.locals.globals.leagues = result[0];
            res.locals.globals.contacts = result[1];

            console.log('globals end');
            next();
        });
    }
};

var getNewsList = function (req, cb) {
    if (req.params.name) {
        TournamentModel.findOne({slug: req.params.name}).lean().exec(function (err, doc) {
            if (err) {
                return next();
            }

            findNews({country: doc.country}, cb);
        });
    } else if (req.params.league) {
        LeagueModel.findOne({slug: req.params.league}).lean().exec(function (err, doc) {
            if (err) {
                return next();
            }

            findNews({leagueId: doc._id}, cb);
        });
    } else {
        findNews({}, cb);
    }

    function findNews(query, cb) {
        var populateOptions = {path: 'country'};
        query.show = true;

        NewsModel.find(query).sort({dc: -1}).lean().populate(populateOptions).exec(function (err, docs) {
            cb(err, docs);
        });
    }
};

module.exports = controller;
