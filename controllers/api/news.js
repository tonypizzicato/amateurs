"use strict";

var newsModel = require('../../models/news');

var api = {
    item: function (req, res) {
        console.log('/api/news/:id GET handled');
    },

    list: function (req, res) {
        console.log('/api/news GET handled');
        newsModel.find().sort('-dc').exec(function (err, news) {
            if (err) {
                res.status(500).json({error: err});
            }

            res.json(news);
        });
    },

    create: function (req, res) {
        console.log('/api/news POST handled');

        newsModel.create(req.body, function (err, article) {
            if (err) {
                res.status(500).json({error: err});
            }

            res.json(article);
        });
    },

    save: function (req, res, next) {
        console.log('/api/news PUT handled');
    },

    delete: function (req, res, next) {
        console.log('/api/news/:id DELETE handled');

        newsModel.remove({_id: req.param('id')}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
            }

            if (count) {
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }

            next();
        });
    }
};

module.exports = api;
