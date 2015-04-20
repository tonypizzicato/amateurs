"use strict";

var _                = require('underscore'),
    moment           = require('moment'),
    RestClient       = require('node-rest-client').Client,
    LeagueModel      = require('../models/league'),
    TournamentModel  = require('../models/tournament'),
    GameArticleModel = require('../models/game-article'),
    PhotoModel       = require('../models/photo'),
    remoteConfig     = require('../config/tinyapi'),
    Promise          = require('promise');


var client = new RestClient(remoteConfig.authOptions);

module.exports = {
    item: function (req, res, next) {
        LeagueModel.findOne({slug: req.params.league}, function (err, league) {
            TournamentModel.findOne({slug: req.params.name, leagueId: league._id, show: true}).lean().exec(function (err, tournament) {
                if (err) {
                    return next(err);
                }
                if (!tournament) {
                    res.status(404);
                    return next();
                }

                client.get(remoteConfig.url + '/games/' + req.params.id, function (game) {
                    game = JSON.parse(game);

                    game.dateTime = game.date ? moment(game.date + ' ' + game.time, 'DD/MM/YYYY HH:mm') : null;

                    var gameLength = tournament.settings ? tournament.settings.gameLength : undefined;
                    if (game.state.toLowerCase() == 'closed') {
                        game.timeGone = gameLength;
                    } else {
                        if (moment().isBefore(moment(game.dateTime))) {
                            game.timeGone = 0;
                        } else {
                            game.timeGone = parseInt(moment.duration(moment(moment()).diff(game.dateTime)).asMinutes());
                        }
                    }
                    game.timeGonePercent = gameLength ? game.timeGone / gameLength * 100 : 100;
                    game.timeGoneDegrees = gameLength ? game.timeGone / gameLength * 360 : 360;

                    game.timeGonePercent = game.timeGonePercent < 100 ? game.timeGonePercent : 100;
                    game.timeGoneDegrees = game.timeGoneDegrees < 360 ? game.timeGoneDegrees : 360;


                    console.log(game.timeGone);
                    console.log(game.timeGonePercent);
                    console.log(game.timeGoneDegrees);

                    if (game.events) {
                        game.events = game.events.sort(function (a, b) {
                            return a.minute < b.minute ? -1 : 1;
                        });
                    }

                    game.players = game.players.map(function (item) {
                        if (!_.isArray(item)) {
                            return [];
                        }
                        item = item.sort(function (a, b) {
                            if (!a.position) {
                                return 1;
                            }
                            if (!b.position) {
                                return -1;
                            }
                            if (a.position.toLowerCase() == 'gk') {
                                return -1;
                            }
                            if (a.position.toLowerCase()[1] == 'b' && b.position.toLowerCase() != 'gk') {
                                return -1;
                            }
                            if (a.position.toLowerCase()[1] == 'm' && b.position.toLowerCase() != 'gk' && b.position.toLowerCase()[1] != 'b') {
                                return -1;
                            }
                            return 1;
                        });

                        return item;
                    });

                    /* Articles */
                    var articles = new Promise(function (resolve, reject) {
                        GameArticleModel.find({gameId: req.params.id, show: true}).exec(function (err, docs) {
                            if (err) {
                                return reject(err);
                            }

                            var preview = _.findWhere(docs, {type: 'preview'});
                            var review  = _.findWhere(docs, {type: 'review'});

                            resolve({preview: preview, review: review});
                        });
                    });

                    /* Articles */
                    var photos = new Promise(function (resolve, reject) {
                        PhotoModel.find({postId: req.params.id}).exec(function (err, docs) {
                            if (err) {
                                return reject(err);
                            }

                            resolve(docs);
                        });
                    });


                    Promise.all([articles, photos]).then(function (result) {
                        res.render('games/item', {
                            tournament: tournament,
                            game:       game,
                            media:      {
                                preview: result[0].preview,
                                review:  result[0].review,
                                photos:  result[1]
                            }
                        });
                    });

                });
            });
        });
    }
};
