"use strict";

var _            = require('underscore'),
    fs           = require('fs.extra'),
    EventEmitter = require('events').EventEmitter,
    Flickr       = require('flickrapi'),
    PhotosModel  = require('../../models/photo'),
    gm           = require('gm');

var flickrOptions = {
    api_key:             "ffd56ffb2631d75166e922ed7b5cc5b6",
    secret:              "34c94bc92ac6cd39",
    user_id:             "130112246@N08",
    access_token:        "72157648906532524-e46b00c69350c43b",
    access_token_secret: "4a0ee319266c77e2",
    permissions:         'delete'

    //api_key:             "01e97ba1bba4167dc7b41bc79bb54f6d",
    //secret:              "89b0f108c26d209f",
    //user_id:             "131060322@N08",
    //access_token:        "72157649526764664-5e88e591f01c6691",
    //access_token_secret: "622c61239e669b53",
    //permissions:         'delete'
};

var eve = new EventEmitter();

var api = {

    /**
     * Get images list by post
     *
     * /api/game-articles GET call
     */
    list: function (req, res) {
        if (req.params.type == 'games') {
            PhotosModel.getByGame(req.params.postId, function (err, docs) {
                if (err) {
                    res.status(500).json({error: err});
                }

                res.json(docs);
            });
        } else {
            res.status(500).json({err: 'Undefined photos type "' + req.params.type + '"'});
        }
    },

    /**
     * Post photo review of a game
     *
     * /api/games/:id/images POST call
     */
    create: function (req, res, next) {
        console.log('/api/games/:id/images POST handled');

        var files        = [],
            filesCount   = _.values(req.files).length,
            filesHandled = 0,
            filesSaved   = 0,
            result       = {};

        _.values(req.files).forEach(function (file) {
            prepareImage(file, function (err, buf) {
                filesHandled++;
                if (err) {
                    console.warn('error preparing image', err);
                } else {

                    files.push({
                        filename: file.name,
                        buffer:   buf,
                        path:     file.path
                    });
                }

                if (filesHandled == filesCount) {
                    _toFlickr(files, onLoad);
                }
            });
        });

        function prepareImage(file, cb) {
            var img = gm(file.buffer, file.name);
            img.size({bufferStream: true}, function (err, size) {
                if (err) {
                    console.warn('error getting size');
                    cb(err);
                }

                var w, h;

                if (size.width > size.height) {
                    w = size.width > 1024 ? 1024 : size.width;
                    h = null;
                } else if (size.width < size.height) {
                    h = size.height > 800 ? 800 : size.height;
                    w = null;
                } else if (size.width > 1024) {
                    w = h = 1024;
                }

                img.resize(w, h);

                img.write(file.path, function (err) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, file.path);
                });
            });
        }

        function onLoad(err, upRes) {
            filesSaved++;
            if (err) {
                console.log('Error loading to flickr', err);
            } else {
                var doc = {
                    type:       'games',
                    postId:     req.params.postId,
                    thumb:      upRes.sizes.thumb,
                    main:       upRes.sizes.main,
                    title:      upRes.title,
                    author:     req.query.user,
                    tournament: req.query.tournament
                };

                PhotosModel.create(doc);
            }

            result[upRes.index] = !err;
            fs.unlinkSync(upRes.path);

            if (filesSaved == filesCount) {
                res.json(result);
            }
        }

    },

    /**
     * Update photo item
     *
     * /api/games/:postId/images/:id PUT call
     */
    save: function (req, res, next) {
        console.log('/api/games/:postId/images/:id PUT handled');
        if (req.params.tournament) {
            req.body.tournament = req.params.tournament;
        }
        PhotosModel.update({_id: req.params.id}, {$set: req.body}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
                return;
            }

            if (count) {
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }
        });
    },


    /**
     * Delete photo item
     *
     * /api/games/:postId/images/:id DELETE call
     */
    delete: function (req, res, next) {
        console.log('/api/games/:postId/images/:id DELETE handled');

        PhotosModel.remove({_id: req.params.id}, function (err, count) {
            if (err) {
                res.status(500).json({error: err});
            }

            if (count) {
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }

            next();
        });
    }
};

var _toFlickr = function (files, cb) {
    Flickr.authenticate(flickrOptions, function (err, flickr) {
            console.log('flickr authed');

            var photos = files.map(function (file) {
                return {title: file.filename, photo: file.buffer, path: file.path};
            });

            var photosCount = photos.length,
                uploaded    = 0;

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

            photos.forEach(function (photo, index) {
                var options = {
                    photo:       photo,
                    permissions: 'write'
                };

                Flickr.upload(options, flickrOptions, function (err, ids) {
                    if (err) {
                        console.warn('Error uploading photos.', err);
                        return cb(err, {path: photo.path, index: index});
                    }
                    uploaded += 1;
                    console.log('Uploaded ' + uploaded + ' photos of ' + photosCount, ids);

                    ids.forEach(function (id) {
                        flickr.photos.getSizes({photo_id: id}, function (err, res) {
                            if (err) {
                                return cb(err, {path: photo.path, index: index});
                            }
                            var sizes = res.sizes.size;

                            var set = {
                                thumb:  getSize(sizes, 'Small'),
                                main:   getSize(sizes, 'Original')
                            };

                            cb(null, {path: photo.path, sizes: set, title: photo.title, index: index});
                        });
                    });
                });
            });
        }
    );
};

module.exports = api;
