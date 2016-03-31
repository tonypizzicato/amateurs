"use strict";

var fs              = require('fs.extra'),
    transliteration = require('transliteration'),
    NewsModel       = require('../../models/news'),
    CategoryModel   = require('../../models/category'),
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
     * Get news item
     *
     * /api/news/:id GET call
     */
    item: function (req, res) {
        console.info('/api/news/:id GET handled');
    },

    /**
     * Get news items list
     *
     * /api/news GET call
     */
    list: function (req, res) {
        console.info('/api/news GET handled');
        NewsModel.find().sort('-dc').exec(function (err, news) {
            if (err) {
                res.status(500).json({error: err});
            }

            res.json(news);
        });
    },

    /**
     * Create new news item
     *
     * /api/news POST call
     */
    create: function (req, res, next) {
        console.info('/api/news POST handled');

        saveArticle(req, function (doc) {
            NewsModel.create(doc, function (err, article) {
                if (err) {
                    res.status(500).json({error: err});
                    return;
                }
                if (!!article.category) {
                    _updateCategory(article._id, article.category);
                }

                res.json(article);
            });
        });
    },

    /**
     * Update news item
     *
     * /api/news/:id PUT call
     */
    save: function (req, res, next) {
        console.info('/api/news PUT handled');

        saveArticle(req, function (doc) {
            NewsModel.update({_id: req.params.id}, {$set: doc}, function (err, count) {
                if (err) {
                    console.info(err);
                    res.status(500).json({error: err});
                    return;
                }

                if (count) {
                    if (!!doc.category) {
                        _updateCategory(doc._id, doc.category);
                    }
                    res.status(200).json({});
                } else {
                    res.status(404).json({});
                }
            });
        });
    },

    /**
     * Delete news item
     * /api/news/:id DELETE call
     */
    delete: function (req, res, next) {
        console.info('/api/news/:id DELETE handled');

        NewsModel.remove({_id: req.params.id}, function (err, count) {
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

var _updateCategory = function (articleId, categoryId) {
    CategoryModel.update({news: articleId}, {$pull: {news: articleId}}, {multi: true}).exec();
    CategoryModel.update({_id: categoryId}, {$addToSet: {news: articleId}}, {multi: true}).exec();
};

var saveArticle = function (req, cb) {
    var doc = req.body;

    if (doc.image) {
        var reg    = /^data:image\/(.+);base64,/;
        var format = doc.image.match(reg);

        if (format && format.length >= 2) {
            format = format[1];
        } else {
            cb(doc);
            return;
        }

        var base64Data = doc.image.replace(/^data:image\/(.+);base64,/, "");

        var dir  = __dirname + '/../../' + (process.env == 'production' ? 'dist' : 'public'),
            path = '/uploads/' + doc.country + '/';

        dir = dir + path;

        if (!fs.existsSync(dir)) {
            fs.mkdirRecursiveSync(dir);
        }

        var filename = transliteration.slugify(doc.title) + "." + format;
        require("fs").writeFile(dir + filename, base64Data, 'base64', function (err) {

            if (err) {
                console.info(err);
                cb(doc);
                next();
            }

            var imageUrl = req.protocol + '://' + req.headers.host + path + filename;
            doc.image    = imageUrl;
            cb(doc);

            Flickr.authenticate(flickrOptions, function (err, flickr) {
                console.info('flickr authed');

                var file = {title: transliteration.slugify(doc.title), photo: dir + filename};

                var options = {
                    photos:      [file],
                    permissions: 'write'
                };

                Flickr.upload(options, flickrOptions, function (err, ids) {
                    if (err) {
                        console.info('Failed uploading news image to flickr.');

                        return;
                    }

                    ids.forEach(function (id) {
                        flickr.photos.getSizes({photo_id: id}, function (err, res) {
                            var s = res.sizes.size.filter(function (item) {
                                return item.label.toLowerCase() == 'large';
                            });

                            if (!s.length) {
                                s = res.sizes.size.filter(function (item) {
                                    return item.label.toLowerCase() == 'original';
                                });
                            }

                            if (s.length) {
                                console.info('flickr uploaded');

                                doc.image = s[0].source;

                                NewsModel.update({image: imageUrl}, {'$set': {image: s[0].source}}).exec();
                            } else {
                                console.info('no size found', res.sizes);
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
        cb(doc);
    }
};

module.exports = api;
