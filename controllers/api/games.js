"use strict";

var RestClient = require('node-rest-client').Client;

var api = {
    /**
     * Get games items list
     *
     * /api/games GET call
     */
    list: function (req, res) {
        console.log('/api/games GET handled');

        var url = 'http://82.196.6.26:443/api/games/';
        var options_auth = {user: "root", password: "horseremorse"};
        var client = new RestClient(options_auth);


        client.get(url + '?leagueId=' + req.param('leagueId'), function (data) {
            var parsed = JSON.parse(data);

            res.json(parsed);

        });
    }
};

module.exports = api;
