"use strict";

module.exports = {

    /**
     * Create new order item
     *
     * /orders POST call
     */
    vdv: function (req, res, next) {
        console.info('/orders POST handled');

        res.render('promo/vdv', {promoTournamentPage: true});
    }
};
