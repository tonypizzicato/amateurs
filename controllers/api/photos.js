"use strict";

var fs          = require('fs.extra'),
    Flickr      = require('flickrapi'),
    PhotosModel = require('../../models/photo');

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

        var flickrOptions = {
            api_key:             "ffd56ffb2631d75166e922ed7b5cc5b6",
            secret:              "34c94bc92ac6cd39",
            user_id:             "130112246@N08",
            access_token:        "72157648906532524-e46b00c69350c43b",
            access_token_secret: "4a0ee319266c77e2",
            permissions:         'delete'
        };

        var files = [];
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + fieldname + ' ' + filename);

            var dir = __dirname + '/../../public',
                path = '/uploads/' + req.params.postId + '/';

            dir = dir + path;
            if (!fs.existsSync(dir)) {
                fs.mkdirRecursiveSync(dir);
            }
            var url = 'http://localhost:9009' + path + filename,
                path = dir + filename,
                local = dir + filename;

            files.push({title: filename, photo: path, url: url, path: local});
            file.pipe(fs.createWriteStream(path));
        });

        req.busboy.on('finish', function () {
            console.log('finish, files uploaded ', files);

            var fls = files.slice(0);
            fls.forEach(function (item) {
                PhotosModel.create({
                    type:   'games',
                    postId: req.params.postId,
                    thumb:  item.url,
                    main:   item.url
                });
            });

            Flickr.authenticate(flickrOptions, function (err, flickr) {
                console.log('flickr authed');

                var options = {
                    photos:      files,
                    permissions: 'write'
                };

                var photosCount = files.length;
                Flickr.upload(options, flickrOptions, function (err, ids) {
                    if (err || !ids.length || ids.length != photosCount) {
                        console.log('Failed uploading photos.');

                        return;
                    }

                    ids.forEach(function (id, index) {
                        flickr.photos.getSizes({photo_id: id}, function (err, res) {
                            var s = res.sizes.size.filter(function (item) {
                                return item.width == 800 || item.width == 640 || item.width == 150;
                            });

                            PhotosModel.remove({main: fls[index].url}).exec();

                            PhotosModel.create({
                                postId:   req.params.postId,
                                type:     'games',
                                thumb:    s[0].source,
                                main:     s[1].source,
                                optional: s[2].source
                            });
                        });
                    });

                    fls.forEach(function (item) {
                        console.log('delete ' + item.path);
                        fs.unlinkSync(item.path);
                    });
                });
            });

            res.json({});
        });

        req.pipe(req.busboy);
    },

    /**
     * Update photo item
     *
     * /api/games/:postId/images/:id PUT call
     */
    save: function (req, res, next) {
        console.log('/api/games/:postId/images/:id PUT handled');
        PhotosModel.update({_id: req.params.id}, {$set: req.body}, function (err, count) {
            console.log(req.body);
            if (err) {
                console.log(err);
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

module.exports = api;
