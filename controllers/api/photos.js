"use strict";

var _               = require('lodash'),
    fs              = require('fs.extra'),
    async           = require('async'),
    Flickr          = require('flickrapi'),
    mongoose        = require('mongoose'),
    PhotosModel     = require('../../models/photo'),
    TournamentModel = require('../../models/tournament'),
    LeagueModel     = require('../../models/league'),
    settings        = require('../../config/settings'),
    gm              = require('gm');

var flickrOptions = {
    api_key:             "ffd56ffb2631d75166e922ed7b5cc5b6",
    secret:              "34c94bc92ac6cd39",
    user_id:             "130112246@N08",
    access_token:        "72157648906532524-e46b00c69350c43b",
    access_token_secret: "4a0ee319266c77e2",
    permissions:         'delete',
    progress:            false

    //api_key:             "01e97ba1bba4167dc7b41bc79bb54f6d",
    //secret:              "89b0f108c26d209f",
    //user_id:             "131060322@N08",
    //access_token:        "72157649526764664-5e88e591f01c6691",
    //access_token_secret: "622c61239e669b53",
    //permissions:         'delete',
    //progress:            false
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
                    res.status(500).json({ error: err });
                }

                res.json(docs);
            });
        } else {
            res.status(500).json({ err: 'Undefined photos type "' + req.params.type + '"' });
        }
    },

    /**
     * Post photo review of a game
     *
     * /api/games/:id/images POST call
     */
    create: function (req, res, next) {
        console.info('/api/games/:id/images POST handled');

        var files  = [],
            result = {},
            photosCount;

        PhotosModel.getByGame(req.params.postId, function (err, docs) {
            photosCount = docs.length;

            console.info('Got ' + _.values(req.files).length + ' files from admin app. Processing images');

            /** Process images and get array of photos for flickr */
            async.mapSeries(_.values(req.files), function (file, callback) {
                file.index = parseInt(file.fieldname.match(/\d+/)[0]);

                /** Convert image and fulsh it to disk */
                async.waterfall([
                    function (cb) {
                        prepareImage(file, cb);
                    },
                    function (filepath, cb) {
                        cb(null, {
                            filename: file.originalname,
                            path:     filepath,
                            index:    file.index
                        });
                    }
                ], callback);

            }, function (err, files) {
                /** Upload to flickr and process result */
                _toFlickr(files, function (err, files) {
                    var sort = 0;
                    files.forEach(function (file) {
                        if (file.sizes) {
                            var doc = {
                                type:       'games',
                                postId:     req.params.postId,
                                thumb:      file.sizes.thumb,
                                main:       file.sizes.main,
                                title:      file.title,
                                author:     req.query.user,
                                sort:       photosCount + sort++,
                                tournament: req.query.tournament
                            };

                            PhotosModel.create(doc);
                        }
                    });

                    files.forEach(function (file) {
                        result[file.index] = !!file.sizes;

                        if (file.path) {
                            fs.unlinkSync(file.path);
                        }
                    });

                    res.json(result);
                });
            });

        });

        function prepareImage(file, cb) {
            var img = gm(file.path).quality(100);
            img.size(function (err, size) {
                if (err || !size || !size.width || !size.height) {
                    console.error('Error getting size', file.originalname);
                    return cb(null, false);
                }

                var w = '', h = '';

                if (size.width > size.height) {
                    w = size.width > 1024 ? 1024 : size.width;
                    h = '';
                } else if (size.width < size.height) {
                    h = size.height > 800 ? 800 : size.height;
                    w = '';
                } else if (size.width > 1024) {
                    w = h = 1024;
                } else {
                    w = size.width;
                    h = size.height;
                }

                img.resize(w, h);

                img.write(file.path, function (err) {
                    if (err) {
                        return cb(null, false);
                    }

                    console.info('Processed image. ' + file.originalname);
                    cb(null, file.path);
                });
            });
        }
    },

    /**
     * Update photo item
     *
     * /api/games/:postId/images/:id PUT call
     */
    save: function (req, res, next) {
        console.info('/api/games/:postId/images/:id PUT handled');
        if (req.params.tournament) {
            req.body.tournament = req.params.tournament;
        }
        PhotosModel.update({ _id: req.params.id }, { $set: req.body }, function (err, count) {
            if (err) {
                res.status(500).json({ error: err });
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
        console.info('/api/games/:postId/images/:id DELETE handled');

        PhotosModel.findOne({ _id: req.params.id }).exec(function (err, doc) {
            if (err || !doc) {
                return res.status(500).json({ error: err });
            }

            PhotosModel.remove({ _id: req.params.id }, function (err, count) {
                if (count) {
                    res.status(200).json({});
                } else {
                    res.status(404).json({});
                }
            });

            if (!!doc.main && !!doc.main.src) {
                Flickr.authenticate(flickrOptions, function (err, flickr) {
                    var id = doc.main.src.match(/\/(\d+)_/)[1];
                    flickr.photos.delete({ photo_id: id }, function (err, res) {
                    });
                });
            }
        });
    },

    photosCountByGames: (req, res) => {
        const ids = (_.isArray(req.query.games) ? req.query.games : (!_.isEmpty(req.query.games) ? [req.query.games] : []))
            .map(id => new mongoose.Types.ObjectId(id));

        const gameUrlMap = {};

        PhotosModel.find({ postId: { $in: ids } }, 'postId tournament').exec((err, games) => {
            games = _.uniq(games, 'postId');

            const tournamentIds = games.map(game => game.tournament);

            TournamentModel.find({ _id: { $in: tournamentIds } }, '_id leagueId slug').exec((err, tournaments) => {
                const leagueIds = tournaments.map(tournament => tournament.leagueId);

                LeagueModel.find({ _id: { $in: leagueIds } }, '_id slug').exec((err, leagues) => {
                    games.forEach(game => {
                        const tournament = _.findWhere(tournaments, { _id: game.tournament});
                        const league       = _.findWhere(leagues, { _id: tournament.leagueId });

                        gameUrlMap[game.postId] = `${settings.host}/${league.slug}/tournaments/${tournament.slug}/matches/${game.postId}#photos`
                    });

                    PhotosModel.aggregate([
                        {
                            $match: { type: req.params.type, postId: { $in: ids } },
                        },
                        {
                            $group: {
                                _id:   '$postId',
                                count: { $sum: 1 }
                            }
                        }
                    ], (err, count) => {
                        const result = ids.map(id => {
                            return {
                                _id:   id,
                                count: _.get(_.findWhere(count, { _id: id }), 'count', 0),
                                url:   gameUrlMap[id]
                            }
                        });
                        res.json({ count: result });
                    });

                });
            });
        });
    }
};

var _toFlickr = function (files, cb) {
    Flickr.authenticate(flickrOptions, function (err, flickr) {
        console.info('flickr authed');

        var getSize = function (sizes, label) {
            var image = _.findWhere(sizes, { label: label });

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
            return { title: file.filename, photo: file.path, path: file.path, index: file.index };
        });

        var photosCount = photos.length,
            uploaded    = 0;


        async.map(photos, function (photo, cb) {
            if (!photo.path) {
                return cb(null, { index: photo.index });
            }

            var options = {
                photo:       photo,
                permissions: 'write'
            };
            Flickr.upload(options, flickrOptions, function (err, ids) {
                if (err) {
                    console.warn('Error uploading photos.', err);
                    return cb(null, { path: photo.path, index: photo.index });
                }

                console.info('Uploaded ' + ++uploaded + ' photos of ' + photosCount, ids);

                ids.forEach(function (id) {
                    flickr.photos.getSizes({ photo_id: id }, function (err, res) {
                        if (err) {
                            return cb(null, { path: photo.path, index: photo.index });
                        }
                        var sizes = res.sizes.size;

                        var set = {
                            thumb: getSize(sizes, 'Small'),
                            main:  getSize(sizes, 'Original')
                        };

                        cb(null, { path: photo.path, sizes: set, title: photo.title, index: photo.index });
                    });
                });
            });
        }, cb);
    });
};

module.exports = api;
