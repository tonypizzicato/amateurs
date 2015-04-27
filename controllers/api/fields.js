"use strict";

var _               = require('underscore'),
    fs              = require('fs.extra'),
    request         = require('request'),
    async           = require('async'),
    gm              = require('gm'),
    transliteration = require('transliteration'),
    FieldModel      = require('../../models/field'),
    TournamentModel = require('../../models/tournament'),
    LeagueModel     = require('../../models/league'),
    Flickr          = require('flickrapi'),
    remoteConfig    = require('../../config/tinyapi');

var flickrOptions = {
    //api_key:             "ffd56ffb2631d75166e922ed7b5cc5b6",
    //secret:              "34c94bc92ac6cd39",
    //user_id:             "130112246@N08",
    //access_token:        "72157648906532524-e46b00c69350c43b",
    //access_token_secret: "4a0ee319266c77e2",
    //permissions:         'delete',
    //progress:            false

    api_key:             "01e97ba1bba4167dc7b41bc79bb54f6d",
    secret:              "89b0f108c26d209f",
    user_id:             "131060322@N08",
    access_token:        "72157649526764664-5e88e591f01c6691",
    access_token_secret: "622c61239e669b53",
    permissions:         'delete',
    progress:            false
};

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

        var field = req.body;

        FieldModel.create(field, function (err, field) {
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

        var field = req.body;

        if (field.image) {
            var reg    = /^data:image\/(.+);base64,/;
            var format = field.image.match(reg);

            if (format && format.length >= 2) {
                format = format[1];

                console.log('uploading image');

                var base64Data   = field.image.replace(/^data:image\/(.+);base64,/, "");
                var decodedImage = new Buffer(base64Data, 'base64');

                var path = __dirname + '/../../public/uploads/';

                var img    = gm(decodedImage);
                var params = {
                    w:    760,
                    h:    null,
                    path: path,
                    name: field._id + '.' + format
                };

                processImage(img, params, function (err, files) {
                    files.forEach(function (file) {
                        if (file.sizes) {
                            var image = {
                                thumb: file.sizes.thumb,
                                main:  file.sizes.main
                            };

                            FieldModel.update({_id: req.params.id}, {$set: {image: image}}, function (err, count) {
                                console.log('Field "' + field.title + '" image uploaded')
                            });
                        }
                    });

                    files.forEach(function (file) {
                        if (file.path) {
                            fs.unlinkSync(file.path);
                        }
                    });
                });

            } else {
                delete field.image;
            }
        }

        field.slug = transliteration.slugify(field.title);
        FieldModel.update({_id: req.params.id}, {$set: field}, function (err, count) {
            if (err) {
                return res.status(500).json({error: err});
            }

            if (field.tournaments.length) {
                console.log(field.tournaments);
                TournamentModel.update({fields: field._id}, {$pull: {fields: field._id}}, {multi: true}).exec();
                TournamentModel.update({_id: {$in: field.tournaments}}, {$addToSet: {fields: field._id}}, {multi: true}).exec();
            }

            res.status(200).json({count: count});
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

var processImage = function (img, params, cb) {
    var filepath = params.path + params.name;

    if (!fs.existsSync(params.path)) {
        fs.mkdirRecursiveSync(params.path);
    }

    img
        .resize(params.w, params.h)
        .write(params.path + params.name, function (err) {
            if (err) {
                return cb(err);
            }

            _toFlickr([{
                filename: params.name,
                path:     filepath,
                index:    params.index != undefined ? params.index : 0
            }], cb);
        });
}

var _toFlickr = function (files, cb) {
    Flickr.authenticate(flickrOptions, function (err, flickr) {
        console.log('flickr authed');

        var getSize = function (sizes, label) {
            var image = _.findWhere(sizes, {label: label});

            if (!image) {
                return undefined;
            }

            return {
                w:   image.width,
                h:   image.height,
                src: image.source
            }
        };

        var photos = files.map(function (file) {
            return {title: file.filename, photo: file.path, path: file.path, index: file.index};
        });

        var photosCount = photos.length,
            uploaded    = 0;


        async.map(photos, function (photo, cb) {
            if (!photo.path) {
                return cb(null, {index: photo.index});
            }

            var options = {
                photo:       photo,
                permissions: 'write'
            };
            Flickr.upload(options, flickrOptions, function (err, ids) {
                if (err) {
                    console.warn('Error uploading photos.', err);
                    return cb(null, {path: photo.path, index: photo.index});
                }

                console.log('Uploaded ' + ++uploaded + ' photos of ' + photosCount, ids);

                ids.forEach(function (id) {
                    flickr.photos.getSizes({photo_id: id}, function (err, res) {
                        if (err) {
                            return cb(null, {path: photo.path, index: photo.index});
                        }
                        var sizes = res.sizes.size;

                        var set = {
                            thumb: getSize(sizes, 'Small 320'),
                            main:  getSize(sizes, 'Original')
                        };

                        cb(null, {path: photo.path, sizes: set, title: photo.title, index: photo.index});
                    });
                });
            });
        }, cb);
    });
};


module.exports = api;
