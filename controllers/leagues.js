'use strict';

var leagues = require('../models/league');

module.exports = {
    leagues: function (req, res) {
        console.log('leagues called');
        res.render('leagues', {leagues: leagues.get(req.param('name')), pageLeagues: true});
    }
};
