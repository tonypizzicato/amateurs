"use strict";

var fs              = require('fs.extra'),
    CategoryModel   = require('../../models/category'),
    NewsModel       = require('../../models/news');

var api = {

    /**
     * Get categories items list
     *
     * /api/categories GET call
     */
    list: function (req, res) {
        console.info('/api/categories GET handled');
        CategoryModel.find().sort({sort: 1}).exec(function (err, categories) {
            if (err) {
                console.info(err);
                res.status(500).json({error: err});
                return;
            }

            res.json(categories);
        });
    },

    /**
     * Create new category item
     *
     * /api/categories POST call
     */
    create: function (req, res) {
        console.info('/api/categories POST handled');

        CategoryModel.create(req.body, function (err, category) {
            if (err) {
                return res.status(500).json({error: err});
            }

            res.json(category);
        });
    },

    /**
     * Update category item
     *
     * /api/categories/:id PUT call
     */
    save: function (req, res) {
        console.info('/api/categories/:id PUT handled');

        CategoryModel.update({_id: req.params.id}, {$set: req.body}, function (err, count) {
            if (err) {
                return res.status(500).json({error: err});
            }

            if (count) {
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }
        });
    },

    /**
     * Delete category item
     *
     * /api/categories/:id DELETE call
     */
    delete: function (req, res) {
        console.info('/api/categories/:id DELETE handled');

        CategoryModel.remove({_id: req.params.id}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
            }

            if (count) {
                NewsModel.update({category: req.params.id}, {$unset: {field: 'category'}}).exec();
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }
        });
    }
};

module.exports = api;
