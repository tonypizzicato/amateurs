"use strict";

var _            = require('underscore'),
    matchesModel = require('../models/match');

module.exports = {
    match: function (req, res) {
        var home = req.param('home'),
            away = req.param('away');

        console.log(home, ';', away);

        var match = matchesModel.get(home.toLowerCase(), away.toLowerCase());

        if (!match) {
            res.status(404).send('Not found League');

            return;
        }

        res.render('match', {match: match});
    }
};
