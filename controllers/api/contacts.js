"use strict";

var ContactModel    = require('../../models/contact'),
    TournamentModel = require('../../models/tournament');

var api = {

    /**
     * Get contacts items list
     *
     * /api/contacts GET call
     */
    list: function (req, res) {
        console.log('/api/contacts GET handled');
        ContactModel.find().sort({sort: 1}).exec(function (err, contacts) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            res.json(contacts);
        });
    },

    /**
     * Create new contact item
     *
     * /api/contacts POST call
     */
    create: function (req, res, next) {
        console.log('/api/contacts POST handled');

        var contact = req.body;
        contact.vk = {
            name: contact['vk[name]'],
            url:  contact['vk[url]']
        }
        contact.tournaments = contact['tournaments[]'] ? contact['tournaments[]'] : [];
        ContactModel.create(contact, function (err, contact) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return next();
            }

            _updateTournament(req.params.id, contact.tournaments);
            res.json(contact);
        });
    },

    /**
     * Update contact item
     *
     * /api/contacts/:id PUT call
     */
    save: function (req, res) {
        console.log('/api/contacts/:id PUT handled');

        var contact = req.body;
        if (contact['vk[name]'] || contact['vk[url]']) {
            contact.vk = {
                name: contact['vk[name]'],
                url:  contact['vk[url]']
            }
        }
        contact.tournaments = contact['tournaments[]'] ? contact['tournaments[]'] : [];
        ContactModel.update({_id: req.params.id}, {$set: contact}, function (err, count) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            if (count) {
                _updateTournament(req.params.id, contact.tournaments);
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }
        });
    },

    /**
     * Delete contact item
     *
     * /api/contacts/:id DELETE call
     */
    delete: function (req, res) {
        console.log('/api/contacts/:id DELETE handled');

        ContactModel.remove({_id: req.params.id}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
            }

            if (count) {
                TournamentModel.update({contacts: req.params.id}, {$pull: {contacts: req.params.id}}).exec();
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }
        });
    }
};

var _updateTournament = function (contactId, tournaments) {
    TournamentModel.update({contacts: contactId}, {$pull: {contacts: contactId}}, {multi: true}).exec();
    TournamentModel.update({_id: {$in: tournaments}}, {$addToSet: {contacts: contactId}}, {multi: true}).exec();

};

module.exports = api;
