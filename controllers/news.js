"use strict";

var _               = require('underscore'),
    moment          = require('moment-timezone'),
    LeagueModel     = require('../models/league'),
    TournamentModel = require('../models/tournament'),
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
                return moment(item.dc).locale('ru').tz(tz).format('DD MMMM YYYY');
            });

            res.locals.globals.newsSticked = Array.prototype.slice.call(docs.filter(function (item) {
                return item.stick == true;
            }), 0, 5);

            next();
        });
    },


    list: function (req, res, next) {

        getNewsList(req, function (err, docs) {
            if (err) {
                return next(err);
            }

            docs = _.groupBy(docs, function (item) {
                return moment(item.dc).locale('ru').tz(tz).format('Do MMMM YYYY, dddd');
            });

            res.render('news/list', {news: docs});
        });
    },

    item: function (req, res, next) {
        var populateOptions = {path: 'country'};
        NewsModel.findOne({slug: req.params.slug}).populate(populateOptions).exec(function (err, article) {
            if (err) {
                return next(err);
            }

            res.render('news/item', {article: article});
        })
    },

    globals: function (req, res, next) {

        /* Leagues */
        var leagues = new Promise(function (resolve, reject) {
            var populateOptions = {path: 'countries', options: {sort: {'sort': 1}}};
            LeagueModel.find({show: true}).sort({sort: 1}).populate(populateOptions).exec(function (err, docs) {
                if (err) {
                    return reject(err);
                }

                resolve(docs);
            });
        });

        Promise.all([leagues]).then(function (result) {
            res.locals.globals.leagues = result[0];

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
        NewsModel.find(query).sort({dc: -1}).lean().populate(populateOptions).exec(function (err, docs) {
            cb(err, docs);
        });
    }
};

module.exports = controller;
