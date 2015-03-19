"use strict";

var moment          = require('moment'),
    RestClient      = require('node-rest-client').Client,
    TournamentModel = require('../models/tournament'),
    ContactModel    = require('../models/contact'),
    remoteConfig    = require('../config/tinyapi');


var client = new RestClient(remoteConfig.authOptions);

module.exports = {
    item: function (req, res, next) {
        TournamentModel.findOne({slug: req.params.name, show: true}).lean().exec(function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc) {
                res.status(404);
                return next();
            }
            client.get(remoteConfig.url + '/games/' + req.params.id, function (game) {
                game = JSON.parse(game);
                var gameLength = doc.settings ? doc.settings.gameLength : undefined;
                if (game.state.toLowerCase() == 'closed') {
                    game.timeGone = gameLength;
                } else {
                    if (moment().isBefore(moment(game.dateTime))) {
                        game.timeGone = 0;
                    } else {
                        game.timeGone = parseInt(moment().diff(moment(game.dateTime).format("mm")));
                    }
                }
                game.timeGonePercent = gameLength ? game.timeGone / gameLength * 100 : 100;
                game.timeGoneDegrees = gameLength ? game.timeGone / gameLength * 360 : 360;

                if (game.events) {
                    game.events = game.events.sort(function (a, b) {
                        return a.minute < b.minute ? -1 : 1;
                    });
                }

                game.players = game.players.map(function (item) {
                    item = item.sort(function (a, b) {
                        if (!a.position) {
                            console.log(a._id);
                            return 1;
                        }
                        if (!b.position) {
                            console.log(b._id);
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
                res.render('games/item', {tournament: doc, game: game});
            });
        });
    }
};
