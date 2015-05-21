"use strict";

var RestClient   = require('node-rest-client').Client,
    remoteConfig = require('../../config/tinyapi'),
    ArticleModel = require('../../models/game-article'),
    PhotosModel  = require('../../models/photo');


var client = new RestClient(remoteConfig.authOptions);

var api = {
    /**
     * Get games items list
     *
     * /api/games GET call
     */
    list: function (req, res) {
        console.log('/api/games GET handled');

        client.get(remoteConfig.url + '/games?leagueId=' + req.query.leagueId, function (data) {
            var parsed = JSON.parse(data);

            res.json(parsed);

        });
    },

    save: function (req, res) {
        console.log('/api/games PUT handled');
        var newGameId = req.body.gameId;

        if (newGameId) {
            ArticleModel.update({gameId: req.params.id}, {$set: {gameId: newGameId}}, {multi: true}, function (err) {
                if (err) {
                    return res.status(500).json({error: err});
                }

                PhotosModel.update({postId: req.params.id}, {$set: {postId: newGameId}}, {multi: true}, function (err, count) {
                    if (err) {
                        return res.status(500).json({error: err});
                    }

                    if (count) {
                        res.status(200).json({count: count});
                    } else {
                        res.status(404).json({});
                    }
                });
            });
        } else {
            res.status(200).json({count: 0});
        }
    }
};

module.exports = api;
