"use strict";

var UserModel = require('../../models/user');

var api = {

    /**
     * Update user item
     *
     * /api/users/:id PUT call
     */
    save: function (req, res) {
        console.info('/api/users/:id PUT handled');

        UserModel.update({_id: req.params.id}, {$set: req.body}, {upsert: true}, function (err, count) {
            if (err) {
                return res.status(500).json({error: err});
            }

            if (count) {
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }
        });
    }
};

module.exports = api;
