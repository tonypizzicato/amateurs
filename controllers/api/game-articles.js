"use strict";

var articlesModel = require('../../models/game-article');

var api = {

    /**
     * Get game articles items list
     *
     * /api/game-articles GET call
     */
    list: function (req, res) {
        console.log('/api/game-articles GET handled');
        articlesModel.find().sort('-dc').exec(function (err, news) {
            if (err) {
                res.status(500).json({error: err});
            }

            res.json(news);
        });
    },

    /**
     * Create new game article item
     *
     * /api/game-articles POST call
     */
    create: function (req, res, next) {
        console.log('/api/game-articles POST handled');

        articlesModel.create(req.body, function (err, article) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            console.log(arguments);
            res.json(article);
        });
    },

    /**
     * Update game article item
     *
     * /api/game-articles/:id PUT call
     */
    save: function (req, res, next) {
        console.log('/api/game-articles PUT handled');
        articlesModel.update({_id: req.params.id}, {$set: req.body}, function (err, count) {
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
     * Delete game article item
     *
     * /api/game-articles/:id DELETE call
     */
    delete: function (req, res, next) {
        console.log('/api/game-articles/:id DELETE handled');

        articlesModel.remove({_id: req.params.id}, function (err, count) {
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
    },

    /**
     * Post photo review of a game
     *
     * /api/game-articles/:id/images POST call
     */
    images: function (req, res, next) {
        console.log('/api/game-articles/:id/images POST handled');

        var fs = require('fs'),
            Flickr = require('flickrapi'),
            gamesModel = require('../../models/photo');

        var flickrOptions = {
            api_key:             "ffd56ffb2631d75166e922ed7b5cc5b6",
            secret:              "34c94bc92ac6cd39",
            user_id:             "130112246@N08",
            access_token:        "72157648906532524-e46b00c69350c43b",
            access_token_secret: "4a0ee319266c77e2",
            permissions:         'delete'
        };

        var files = [];

        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + fieldname + ' ' + filename);

            var dir = __dirname + '/uploads/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            var path = dir + filename;

            files.push({title: filename, photo: path});
            file.pipe(fs.createWriteStream(path));
        });

        req.busboy.on('finish', function () {
            console.log('finish, files uploaded ', files);

            var fls = files.slice(0);
            fls.forEach(function (item) {
                gamesModel.create({
                    type:   'game',
                    postId: req.params.id,
                    thumb:  item.photo,
                    main:   item.photo
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

                    ids.forEach(function (id) {
                        flickr.photos.getSizes({photo_id: id}, function (err, res) {
                            console.dir(res);
                            var s = res.sizes.size.filter(function (item) {
                                return item.width == 1024 || item.width == 800 || item.width == 150;
                            });

                            gamesModel.findOneAndUpdate({postId: req.params.id}, {
                                type:     'game',
                                thumb:    s[0].source,
                                main:     s[1].source,
                                optional: s[2].source
                            }, {upsert: true});

                            console.dir(s);
                        });
                    });

                    fls.forEach(function (item) {
                        fs.unlinkSync(item.photo);
                    });
                });
            });

            res.json({});
        });
    }
};

module.exports = api;
