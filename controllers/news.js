"use strict";

var NewsModel = require('../models/news');

var controller = {
    list: function (req, res, next) {
        NewsModel.find().sort({dc: -1}).exec(function (err, news) {
            if (err) {
                return next(err);
            }
            res.render('news', {news: news});
        });
    },

    item: function (req, res, next) {
        NewsModel.findOne({slug: req.params.slug}, function (err, article) {
            if (err) {
                return next(err);
            }

            res.render('article', {article: article});
        })
    }
};

module.exports = controller;