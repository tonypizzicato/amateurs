"use strict";

import _ from 'lodash';
import LeagueModel from '../models/league';
import request, { SCOPE_SITE } from '../utils/request';

var positions = {
    photographer: { one: 'Фотограф', plural: 'Фотографы' },
    operator:     { one: 'Оператор', plural: 'Операторы' },
    referee:      { one: 'Судья', plural: 'Судьи' }
};


module.exports = {
    list: function (req, res) {
        LeagueModel.findOne({ slug: req.params.league }).exec(function (err, league) {
            request(`/league/${league._id}/persons`, SCOPE_SITE, true)
                .then(response => {
                    const stuff = {};

                    response.data.forEach(function (item) {
                        if (!item.show) {
                            return;
                        }

                        const position = _.get(item, 'type.code', 'photographer');

                        stuff[position] = stuff[position] ? [...stuff[position], item] : [item];
                    });

                    res.render('stuff/list', { stuff: stuff, positions: positions, pageStuff: true });
                });
        });
    },

    bosses: function (req, res) {
        LeagueModel.findOne({ slug: req.params.league }).exec(function (err, league) {
            res.render('stuff/bosses', { pageBosses: true });
        });
    }
};
