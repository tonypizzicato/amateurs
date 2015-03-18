"use strict";

var fields = require('../models/fields');

module.exports = {
    fields: function (req, res) {
        console.log('fields called');
        res.render('fields', {fields: fields.get(req.params.name), pageFields: true});
    }
};
