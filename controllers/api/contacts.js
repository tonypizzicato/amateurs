"use strict";

var fs              = require('fs.extra'),
    transliteration = require('transliteration'),
    ContactModel    = require('../../models/contact'),
    TournamentModel = require('../../models/tournament'),
    Flickr          = require('flickrapi');

var flickrOptions = {
    api_key:             "ffd56ffb2631d75166e922ed7b5cc5b6",
    secret:              "34c94bc92ac6cd39",
    user_id:             "130112246@N08",
    access_token:        "72157648906532524-e46b00c69350c43b",
    access_token_secret: "4a0ee319266c77e2",
    permissions:         'delete'
};

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

        saveContact(req, function (doc) {
            doc.vk = {
                name: doc['vk[name]'],
                url:  doc['vk[url]']
            };
            doc.tournaments = doc['tournaments[]'] ? doc['tournaments[]'] : [];
            ContactModel.create(doc, function (err, contact) {
                if (err) {
                    console.log(err);
                    res.status(500).json({error: err});
                    return next();
                }

                if (doc.tournaments.length) {
                    _updateTournament(contact._id, contact.tournaments);
                }
                res.json(contact);
            });
        });
    },

    /**
     * Update contact item
     *
     * /api/contacts/:id PUT call
     */
    save: function (req, res) {
        console.log('/api/contacts/:id PUT handled');

        saveContact(req, function (doc) {

            doc.tournaments = doc['tournaments[]'] ? doc['tournaments[]'] : [];

            if (doc['vk[name]'] || doc['vk[url]']) {
                doc.vk = {
                    name: doc['vk[name]'],
                    url:  doc['vk[url]']
                }
            }

            ContactModel.update({_id: req.params.id}, {$set: doc}, function (err, count) {
                if (err) {
                    console.log(err);
                    res.status(500).json({error: err});
                    return;
                }

                if (count) {
                    if (doc.tournaments.length) {
                        _updateTournament(req.params.id, doc.tournaments);
                    }
                    res.status(200).json({});
                } else {
                    res.status(404).json({});
                }
            });
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

var saveContact = function (req, save) {
    var doc = req.body;

    if (doc.image) {
        var reg = /^data:image\/(.+);base64,/;
        var format = doc.image.match(reg);

        if (format && format.length >= 2) {
            format = format[1];
        } else {
            save(doc);
            return;
        }

        var base64Data = doc.image.replace(/^data:image\/(.+);base64,/, "");

        var dir = __dirname + '/../../' + (process.env == 'production' ? 'dist' : 'public'),
            path = '/uploads/' + doc.leagueId + '/';

        dir = dir + path;

        if (!fs.existsSync(dir)) {
            fs.mkdirRecursiveSync(dir);
        }

        var filename = transliteration.slugify(doc.name) + "." + format;
        require("fs").writeFile(dir + filename, base64Data, 'base64', function (err) {

            if (err) {
                return save(doc);
            }

            var imageUrl = req.protocol + '://' + req.headers.host + path + filename;
            doc.image = imageUrl;
            save(doc);

            Flickr.authenticate(flickrOptions, function (err, flickr) {
                console.log('flickr authed');

                var file = {title: transliteration.slugify(doc.name), photo: dir + filename};

                var options = {
                    photos:      [file],
                    permissions: 'write'
                };

                Flickr.upload(options, flickrOptions, function (err, ids) {
                    if (err) {
                        console.log('Failed uploading news image to flickr.');

                        return;
                    }

                    ids.forEach(function (id) {
                        flickr.photos.getSizes({photo_id: id}, function (err, res) {
                            var s = res.sizes.size.filter(function (item) {
                                return item.label.toLowerCase() == 'small';
                            });

                            if (!s.length) {
                                s = res.sizes.size.filter(function (item) {
                                    return item.label.toLowerCase() == 'original';
                                });
                            }

                            if (s.length) {
                                console.log('flickr uploaded');

                                doc.image = s[0].source;

                                ContactModel.update({image: imageUrl}, {'$set': {image: s[0].source}}).exec();
                            } else {
                                console.log('no size found', res.sizes);
                            }
                        });
                    });

                    // TODO: clear with cron (?)
                    //fs.unlinkSync(dir + filename);
                    //fs.unlinkSync(dir);
                });
            });
        });
    } else {
        save(doc);
    }
};


module.exports = api;
