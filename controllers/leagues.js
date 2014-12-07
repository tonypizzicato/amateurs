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

        league.exec(function(err, league) {
            if (!league) {
                res.status(404).send('Not found League');

                return;
            }

            res.render('league', {league: league.pop(), tableFull: true});
        });
    }
};
