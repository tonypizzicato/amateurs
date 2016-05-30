"use strict";

var _            = require('lodash'),
    LeagueModel  = require('../models/league'),
    ContactModel = require('../models/contact');

module.exports = {
    list: function (req, res) {
        LeagueModel.findOne({slug: req.league}, function (err, league) {
            ContactModel.find({leagueId: league._id, show: true}).sort({sort: 1}).exec(function (err, contacts) {
                ContactModel.findOne({leagueId: league._id, show: true, toCall: true}).exec(function (err, contact) {
                    res.render('contacts/list', {contacts: contacts, toCall: contact, pageContacts: true});
                });
            });
        });
    }
};
