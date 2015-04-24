"use strict";

var LeagueModel = require('../models/league'),
    FieldModel  = require('../models/field');

module.exports = {

    item: function (req, res) {
    },

    list: function (req, res) {
        LeagueModel.findOne({slug: req.params.league}).exec(function (err, league) {
            FieldModel.find({show: true, leagueId: league._id}, function (err, fields) {
                res.render('fields/list', {fields: fields, pageFields: true});
            });
        })
    }
};
