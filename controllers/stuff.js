"use strict";

var _           = require('underscore'),
    LeagueModel = require('../models/league'),
    UserModel   = require('../models/user');

module.exports = {
    list: function (req, res) {
        LeagueModel.findOne({slug: req.params.league}).exec(function (err, league) {

            UserModel.find({leagueId: league._id, avatar: {$ne: null}}).exec(function (err, users) {

                res.render('stuff/list', {stuff: users, pageStuff: true});
            });

        });
    }
};
