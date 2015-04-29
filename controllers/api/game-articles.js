"use strict";

var fs              = require('fs.extra'),
    transliteration = require('transliteration'),
    ArticleModel    = require('../../models/game-article'),
    Flickr          = require('flickrapi');

var flickrOptions = {
    api_key:             "ffd56ffb2631d75166e922ed7b5cc5b6",
    secret:              "34c94bc92ac6cd39",
    user_id:             "130112246@N08",
    access_token:        "72157648906532524-e46b00c69350c43b",
    access_token_secret: "4a0ee319266c77e2",
    permissions:         'delete',
    progress:            false
};

var api = {

    /**
     * Get game articles items list
     *
     * /api/game-articles/:id GET call
     */
    item: function (req, res) {
        console.log('/api/game-articles/:id GET handled');
        ArticleModel.findOne(req.params.id).exec(function (err, article) {
            if (err) {
                res.status(500).json({error: err});
            }

            res.json(article);
        });
    },

    /**
     * Get game article item by type and game id
     *
     * /api/game-articles/:type/:gameId GET call
     */
    byGame: function (req, res) {
        console.log('/api/game-articles/:type/:gameId GET handled');
        console.log({gamesId: req.params.gameId, type: req.params.type});
        ArticleModel.findOne({gameId: req.params.gameId, type: req.params.type}).exec(function (err, article) {
            if (err) {
                res.status(500).json({error: err});
            }

            res.json(article);
        });
    },

    /**
     * Get game articles items list
     *
     * /api/game-articles GET call
     */
    list: function (req, res) {
        console.log('/api/game-articles GET handled');
        ArticleModel.find().sort('-dc').exec(function (err, news) {
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

        saveArticle(req, function (doc) {
            ArticleModel.create(doc, function (err, article) {
                if (err) {
                    console.log(err);
                    res.status(500).json({error: err});
                    return next();
                }

                res.json(article);
            });
        });
    },

    /**
     * Update game article item
     *
     * /api/game-articles/:id PUT call
     */
    save: function (req, res, next) {
        console.log('/api/game-articles PUT handled');

        saveArticle(req, function (doc) {
            /** pre save hack(( */
            doc.du = new Date();
            ArticleModel.update({_id: req.params.id}, {$set: doc}, function (err, count) {
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
        });
    },

    /**
     * Delete game article item
     *
     * /api/game-articles/:id DELETE call
     */
    delete: function (req, res, next) {
        console.log('/api/game-articles/:id DELETE handled');

        ArticleModel.remove({_id: req.params.id}, function (err, count) {
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

var saveArticle = function (req, save) {
    var doc = req.body;

    var images = [];

    if (doc.imageHome) {
        images.push({image: doc.imageHome, title: 'imageHome'});
    }
    if (doc.imageAway) {
        images.push({image: doc.imageAway, title: 'imageAway'});
    }

    if (images.length) {
        images.forEach(function (image) {
            var reg    = /^data:image\/(.+);base64,/;
            var format = image.image.match(reg);

            if (format && format.length >= 2) {
                format = format[1];
            } else {
                return;
            }

            var base64Data = image.image.replace(/^data:image\/(.+);base64,/, "");

            var dir  = __dirname + '/../../' + (process.env == 'production' ? 'dist' : 'public'),
                path = '/uploads/' + doc.tournament + '/';

            dir = dir + path;

            if (!fs.existsSync(dir)) {
                fs.mkdirRecursiveSync(dir);
            }

            var filename = transliteration.slugify(doc.gameId + image.title) + "." + format;
            require("fs").writeFileSync(dir + filename, base64Data, 'base64');

            var imageUrl     = req.protocol + '://' + req.headers.host + path + filename;
            doc[image.title] = imageUrl;

            Flickr.authenticate(flickrOptions, function (err, flickr) {
                console.log('flickr authed');

                var file = {title: transliteration.slugify(doc.gameId + image.title), photo: dir + filename};

                var options = {
                    photos:      [file],
                    permissions: 'write',
                    silent:      true
                };

                Flickr.upload(options, flickrOptions, function (err, ids) {
                    if (err) {
                        console.log('Failed uploading news image to flickr.');

                        return;
                    }

                    ids.forEach(function (id) {
                        flickr.photos.getSizes({photo_id: id}, function (err, res) {
                            var s = res.sizes.size.filter(function (item) {
                                return item.label.toLowerCase() == 'medium';
                            });

                            if (!s.length) {
                                s = res.sizes.size.filter(function (item) {
                                    return item.label.toLowerCase() == 'original';
                                });
                            }

                            if (s.length) {
                                console.log('flickr uploaded');

                                doc[image.title] = s[0].source;

                                var m            = {}, set = {};
                                m.gameId         = doc.gameId;
                                m.type           = 'preview';
                                set[image.title] = s[0].source;

                                ArticleModel.update(m, {'$set': set}).exec();
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
    }

    save(doc);
};

module.exports = api;
