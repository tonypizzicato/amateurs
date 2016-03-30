"use strict";

var RestClient      = require('node-rest-client').Client,
    remoteConfig    = require('../../config/tinyapi'),
    TournamentModel = require('../../models/tournament'),
    ArticleModel    = require('../../models/game-article'),
    PhotosModel     = require('../../models/photo');


var client = new RestClient(remoteConfig.authOptions);

var api = {
    /**
     * Get games items list
     *
     * /api/games GET call
     */
    list: function (req, res) {
        console.info('/api/games GET handled');

        TournamentModel.find({leagueId: req.query.leagueId}).exec(function (err, tournaments) {
            var ids = tournaments.map(function (item) {
                return item._id;
            });

            if(ids.length) {
                client.get(remoteConfig.url + '/tournaments/games?ids=' + ids.join('&ids='), function (data) {
                    var parsed = JSON.parse(data);

                    res.json(parsed);
                });
            } else {
                res.json([]);
            }
        });
    },

    save: function (req, res) {
        console.info('/api/games PUT handled');
        var newGameId       = req.body.gameId;
        var newTournamentId = req.body.tournament;

        if (newGameId && newTournamentId) {
            var changed = 0;

            ArticleModel.update({gameId: req.params.id}, {$set: {gameId: newGameId, tournament: newTournamentId}}, {multi: true}, function (err, count) {
                if (err) {
                    return res.status(500).json({error: err});
                }
                changed += count;

                PhotosModel.update({postId: req.params.id}, {$set: {postId: newGameId, tournament: newTournamentId}}, {multi: true}, function (err, count) {
                    if (err) {
                        return res.status(500).json({error: err});
                    }

                    changed += count;

                    res.status(200).json({count: changed});
                });
            });
        } else {
            res.status(500).json({error: 'No gameId or tournament parameter set'});
        }
    }
};

module.exports = api;
