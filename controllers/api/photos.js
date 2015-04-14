"use strict";

var _           = require('underscore'),
    fs          = require('fs.extra'),
    Flickr      = require('flickrapi'),
    PhotosModel = require('../../models/photo'),
    gm          = require('gm');

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
            result       = {},
            photosCount;

        PhotosModel.getByGame(req.params.postId, function (err, docs) {
            photosCount = docs.length;

            console.log('Got ' + _.values(req.files).length + ' files from admin app. Processing images');
            _.values(req.files).forEach(function (file) {
                file.index = parseInt(file.fieldname.match(/\d+/)[0]);

                prepareImage(file, function (err, buf) {
                    filesHandled++;
                    if (err) {
                        console.warn('error preparing image', err, file.name);
                    } else {

                        files.push({
                            filename: file.name,
                            buffer:   buf,
                            path:     file.path,
                            index:    file.index
                        });
                    }

                    if (filesHandled == filesCount) {
                        _toFlickr(files, onLoad);
                    }
                });
            });
        });

        function prepareImage(file, cb) {
            var img = gm(file.buffer, file.name);
            img.size({bufferStream: true}, function (err, size) {
                if (err || !size || !size.width || !size.height) {
                    console.warn('error getting size', file.name);
                    cb(err);
                }
                console.log('Got image size. ' + file.name);

                var w, h;

                if (size.width > size.height) {
                    w = size.width > 1024 ? 1024 : size.width;
                    h = null;
                } else if (size.width < size.height) {
                    h = size.height > 800 ? 800 : size.height;
                    w = null;
                } else if (size.width > 1024) {
                    w = h = 1024;
                } else {
                    w = size.width;
                    h = size.height;
                }

                img.resize(w, h);
                console.log('Resized image. ' + file.name, 'Trying to save image to ' + file.path);

                img.write(file.path, function (err) {
                    if (err) {
                        return cb(err);
                    }

                    console.log('Processed image. ' + file.name);
                    cb(null, file.path);
                });
            });
        }

        function onLoad(err, upRes) {
            filesSaved++;

            result[upRes.index] = !err;

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
                    sort:       photosCount + upRes.index + 1,
                    tournament: req.query.tournament
                };

                if (result[upRes.index]) {
                    PhotosModel.create(doc);
                }
            }

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
    delete: function (req, res) {
        console.log('/api/games/:postId/images/:id DELETE handled');

        PhotosModel.findOne({_id: req.params.id}).exec(function (err, doc) {
            if (err || !doc) {
                return res.status(500).json({error: err});
            }

            PhotosModel.remove({_id: req.params.id}, function (err, count) {
                if (count) {
                    res.status(200).json({});
                } else {
                    res.status(404).json({});
                }
            });

            if (!!doc.main && !!doc.main.src) {
                Flickr.authenticate(flickrOptions, function (err, flickr) {
                    var id = doc.main.src.match(/\/(\d+)_/)[1];
                    flickr.photos.delete({photo_id: id}, function (err, res) {
                    });
                });
            }
        });
    }
};

var _toFlickr = function (files, cb) {
    Flickr.authenticate(flickrOptions, function (err, flickr) {
            console.log('flickr authed');

            var photos = files.map(function (file) {
                return {title: file.filename, photo: file.buffer, path: file.path, index: file.index};
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

            photos.forEach(function (photo) {
                var options = {
                    photo:       photo,
                    permissions: 'write'
                };

                Flickr.upload(options, flickrOptions, function (err, ids) {
                    if (err) {
                        console.warn('Error uploading photos.', err);
                        return cb(err, {path: photo.path, index: photo.index});
                    }
                    uploaded += 1;
                    console.log('Uploaded ' + uploaded + ' photos of ' + photosCount, ids);

                    ids.forEach(function (id) {
                        flickr.photos.getSizes({photo_id: id}, function (err, res) {
                            if (err) {
                                return cb(err, {path: photo.path, index: photo.index});
                            }
                            var sizes = res.sizes.size;

                            var set = {
                                thumb: getSize(sizes, 'Small'),
                                main:  getSize(sizes, 'Original')
                            };

                            cb(null, {path: photo.path, sizes: set, title: photo.title, index: photo.index});
                        });
                    });
                });
            });
        }
    );
};

module.exports = api;
