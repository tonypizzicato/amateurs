"use strict";

var _            = require('underscore'),
    ContactModel = require('../models/contact');

module.exports = {
    list: function (req, res) {
        ContactModel.find({show: true}).sort({sort: 1}).exec(function (err, docs) {
            res.render('contacts/list', {contacts: docs, pageContacts: true});
        });
    }
};
