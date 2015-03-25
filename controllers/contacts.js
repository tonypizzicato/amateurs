"use strict";

var _            = require('underscore'),
    ContactModel = require('../models/contact');

module.exports = {
    list: function (req, res) {
        ContactModel.find({show: true}).exec(function (err, docs) {

            docs = _.groupBy(docs, function (item) {
                return item.name;
            });

            docs = _.values(_.map(docs, function (item) {
                return _.first(item);
            }));
            res.render('contacts/list', {contacts: docs, pageContacts: true});
        });
    }
};
