"use strict";

var _           = require('lodash'),
    LeagueModel = require('../models/league'),
    UserModel   = require('../models/user');

var positions = {
    photographer: {one: 'Фотограф', plural: 'Фотографы'},
    videographer: {one: 'Оператор', plural: 'Операторы'},
    referee:      {one: 'Судья', plural: 'Судьи'}
};


module.exports = {
    list: function (req, res) {
        LeagueModel.findOne({slug: req.params.league}).exec(function (err, league) {

            UserModel.find({leagueId: league._id, avatar: {$ne: null}}).exec(function (err, users) {
                var stuff = {};

                Object.keys(positions).forEach(function (position) {
                    stuff[position] = _.filter(users, function (user) {
                        return _.contains(user.positions, position);
                    });
                });

                res.render('stuff/list', {stuff: stuff, positions: positions, pageStuff: true});
            });

        });
    },

    bosses: function(req, res) {
        LeagueModel.findOne({slug: req.params.league}).exec(function (err, league) {
            res.render('stuff/bosses', {pageBosses: true});
        });
    }
};
