"use strict";

var path = require('path');

module.exports = {
    index: function (req, res) {
        res.render('main', {pageIndex: true});
    },

    underConstruction: function (req, res) {
        res.sendfile(path.join(req.app.get('public') + '/construct.html'));
    },

    nationalsPromo: function (req, res) {
        res.sendfile(path.join(req.app.get('public') + '/promo/nationals.html'));
    }
};
