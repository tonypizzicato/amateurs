"use strict";

var RestClient   = require('node-rest-client').Client,
    remoteConfig = require('../../config/tinyapi');


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
    }
};

module.exports = api;
