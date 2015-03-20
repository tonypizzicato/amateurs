"use strict";

var fs        = require('fs'),
    newsModel = require('../../models/news');

var api = {

    /**
     * Get news item
     *
     * /api/news/:id GET call
     */
    item: function (req, res) {
        console.log('/api/news/:id GET handled');
    },

    /**
     * Get news items list
     *
     * /api/news GET call
     */
    list: function (req, res) {
        console.log('/api/news GET handled');
        newsModel.find().sort('-dc').exec(function (err, news) {
            if (err) {
                res.status(500).json({error: err});
            }

            res.json(news);
        });
    },

    /**
     * Create new news item
     *
     * /api/news POST call
     */
    create: function (req, res, next) {
        console.log('/api/news POST handled');

        var doc = req.body;

        newsModel.create(doc, function (err, article) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            console.log(arguments);
            res.json(article);
        });
    },

    /**
     * Update news item
     *
     * /api/news/:id PUT call
     */
    save: function (req, res, next) {
        console.log('/api/news PUT handled');

        var doc = req.body;

        newsModel.update({_id: req.params.id}, {$set: doc}, function (err, count) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            if (count) {
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }
        });
    },

    /**
     * Delete news item
     * /api/news/:id DELETE call
     */
    delete: function (req, res, next) {
        console.log('/api/news/:id DELETE handled');

        newsModel.remove({_id: req.params.id}, function (err, count) {
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
