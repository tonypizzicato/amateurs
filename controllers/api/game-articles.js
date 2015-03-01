"use strict";

var articlesModel = require('../../models/game-article');

var api = {

    /**
     * Get game articles items list
     *
     * /api/game-articles GET call
     */
    list: function (req, res) {
        console.log('/api/game-articles GET handled');
        articlesModel.find().sort('-dc').exec(function (err, news) {
            if (err) {
                res.status(500).json({error: err});
            }

            res.json(news);
        });
    },

    /**
     * Create new game article item
     *
     * /api/game-articles POST call
     */
    create: function (req, res, next) {
        console.log('/api/game-articles POST handled');

        articlesModel.create(req.body, function (err, article) {
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
     * Update game article item
     *
     * /api/game-articles/:id PUT call
     */
    save: function (req, res, next) {
        console.log('/api/game-articles PUT handled');
        articlesModel.update({_id: req.param('id')}, {$set: req.body}, function (err, count) {
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
     * Delete game article item
     * /api/game-articles/:id DELETE call
     */
    delete: function (req, res, next) {
        console.log('/api/game-articles/:id DELETE handled');

        articlesModel.remove({_id: req.param('id')}, function (err, count) {
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
