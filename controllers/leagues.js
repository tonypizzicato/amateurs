'use strict';

var leaguesModel = require('../models/league');

module.exports = {
    leagues: function (req, res) {
        console.log('leagues called');
        res.render('leagues', {leagues: leaguesModel.get(req.param('name')), pageLeagues: true});
    },

    league: function (req, res) {
        var leagueName = req.param('name'),
            league = leaguesModel.get(leagueName);


        league.then(function(leagues) {
            if (!leagues.length) {
                res.status(404).send('Not found League');

                return;
            }

            res.render('league', {league: leagues.pop().toObject(), tableFull: false});
        });
    },

    table: function(req, res) {
        var leagueName = req.param('name'),
            league = leaguesModel.get(leagueName);


        league.then(function(leagues) {
            if (!leagues.length) {
                res.status(404).send('Not found League');

                return;
            }

            res.render('table', {league: leagues.pop().toObject(), tableFull: true});
        });
    }
};
