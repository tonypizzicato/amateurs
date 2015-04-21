"use strict";

var request         = require('request'),
    FieldModel      = require('../../models/field'),
    TournamentModel = require('../../models/tournament'),
    LeagueModel     = require('../../models/league'),
    async           = require('async'),
    remoteConfig    = require('../../config/tinyapi');

var api = {

    /**
     * Get tournament item
     *
     * /api/fields/:id GET call
     */
    item: function (req, res) {
        console.log('/api/fields/:id GET handled');
    },

    /**
     * Get fields items list
     *
     * /api/fields GET call
     */
    list: function (req, res) {
        console.log('/api/fields GET handled');

        LeagueModel.find().exec(function (err, leagues) {
            if (err) {
                return res.status(500).json({error: err});
            }

            var tasks = [];

            leagues.forEach(function (league) {
                var requestParams = {
                    uri:  remoteConfig.url + '/places?leagueId=' + league._id,
                    auth: remoteConfig.authOptions,
                    gzip: true,
                    json: true
                };

                var task = function (cb) {
                    request.get(requestParams, function (err, response, fields) {

                        fields.forEach(function (field, index) {
                            field.remoteId = field._id;
                            field.title    = field.name;
                            field.leagueId = league._id;
                            field.sort     = index;

                            delete field.__v;

                            FieldModel.findOneAndUpdate({remoteId: field._id}, field, {upsert: true}).exec();
                        });
                        cb();
                    });
                };

                tasks.push(task);
            });

            async.parallel(tasks, function () {
                FieldModel.find().sort({sort: 1}).populate('tournaments').exec(function (err, fields) {
                    if (err) {
                        res.status(500).json({error: err});
                        return;
                    }

                    res.json(fields);
                });
            });
        });
    },

    /**
     * Create new tournament item
     *
     * /api/fields POST call
     */
    create: function (req, res, next) {
        console.log('/api/fields POST handled');

        FieldModel.create(req.body, function (err, field) {
            if (err) {
                res.status(500).json({error: err});
                return;
            }

            if (field.tournaments) {
                TournamentModel.update({$in: {_id: field.tournaments}}, {$addToSet: {fields: field._id}}, {multi: true}).exec();
            }

            res.json(field);
        });
    },

    /**
     * Update tournament item
     *
     * /api/fields/:id PUT call
     */
    save: function (req, res, next) {
        console.log('/api/fields/:id PUT handled');

        FieldModel.update({_id: req.params.id}, {$set: req.body}, function (err, count) {
            if (err) {
                return res.status(500).json({error: err});
            }

            res.status(200).json({});
        });
    },

    /**
     * Delete tournament item
     *
     * /api/fields/:id DELETE call
     */
    delete: function (req, res) {
        console.log('/api/fields/:id DELETE handled');

        FieldModel.remove({_id: req.params.id}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
            }

            if (count) {
                TournamentModel.update({fields: req.params.id}, {$pull: {fields: req.params.id}}).exec();
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }

            next();
        });
    }
};

module.exports = api;
