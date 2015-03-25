"use strict";

var fields = require('../models/fields');

module.exports = {
    list: function (req, res) {
        console.log('fields called');
        res.render('fields/list', {fields: [], pageFields: true});
    }
};
