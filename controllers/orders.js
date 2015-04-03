"use strict";

var OrderModel = require('../models/order');

module.exports = {

    /**
     * Create new order item
     *
     * /orders POST call
     */
    create: function (req, res, next) {
        console.log('/orders POST handled');

        OrderModel.create(req.body, function (err, order) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            req.session.order = order._id;

            res.json(order);
        });
    }
};
