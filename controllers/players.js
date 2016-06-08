"use strict";

var _       = require('lodash'),
    moment  = require('moment'),
    Promise = require('promise');

import request from '../utils/request';

module.exports = {
    item: function (req, res, next) {

        request(`/players/${req.params.id}`)
            .then(response => {
                const player = response.data;

                res.title(`${player.profile.name} ${player.profile.teamName}`);

                res.render('players/item', { player, pagePlayer: true });
            });
    }
};
