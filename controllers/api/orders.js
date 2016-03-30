"use strict";

var OrderModel  = require('../../models/order');

var api = {

    /**
     * Get order items list
     *
     * /api/orders GET call
     */
    list: function (req, res) {
        console.info('/api/countries GET handled');
        OrderModel.find().sort({dc: 1}).exec(function (err, orders) {
            if (err) {
                console.info(err);
                res.status(500).json({error: err});
                return;
            }

            res.json(orders);
        });
    }
};

module.exports = api;
